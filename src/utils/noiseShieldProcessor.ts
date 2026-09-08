/**
 * Audio Noise Shield & DSP (Digital Signal Processing) Engine
 * Designed for noisy, disturbed, and outdoor environments (e.g. Tehsil centers, CSCs, cyber cafes, streets).
 */

export interface NoiseStats {
  volume: number;        // 0 to 100
  noiseFloor: number;    // estimated ambient baseline
  status: 'optimal' | 'noisy' | 'very_noisy' | 'silent';
  isSpeaking: boolean;
}

export class NoiseShieldProcessor {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private highpassFilter: BiquadFilterNode | null = null;
  private lowpassFilter: BiquadFilterNode | null = null;
  private animFrameId: number | null = null;
  private isShieldActive: boolean = true;
  private noiseFloor: number = 15;
  private smoothingFactor: number = 0.85;

  /**
   * Request microphone stream with aggressive hardware & browser noise cancellation
   */
  public async getCleanAudioStream(): Promise<MediaStream | null> {
    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: { ideal: true },
          noiseSuppression: { ideal: true },
          autoGainControl: { ideal: true },
          sampleRate: { ideal: 48000 },
          channelCount: { ideal: 1 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.mediaStream = stream;
      this.setupAudioGraph(stream);
      return stream;
    } catch (err) {
      console.warn('Could not acquire DSP audio stream:', err);
      return null;
    }
  }

  /**
   * Set up Web Audio DSP Filter graph (Highpass 120Hz + Lowpass 3800Hz voice band)
   */
  private setupAudioGraph(stream: MediaStream) {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioContext = new AudioContextClass();
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const source = this.audioContext.createMediaStreamSource(stream);

      // 1. Highpass filter to eliminate low-frequency rumble, fan noise, and traffic hum (<120Hz)
      this.highpassFilter = this.audioContext.createBiquadFilter();
      this.highpassFilter.type = 'highpass';
      this.highpassFilter.frequency.value = 120; // Cut off < 120 Hz

      // 2. Lowpass filter to eliminate high-frequency hiss, screeching, and electronics noise (>3600Hz)
      this.lowpassFilter = this.audioContext.createBiquadFilter();
      this.lowpassFilter.type = 'lowpass';
      this.lowpassFilter.frequency.value = 3600; // Human vocal bandwidth limit

      // 3. Analyser for volume metering & noise thresholding
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      // Connect graph: Source -> Highpass -> Lowpass -> Analyser
      source.connect(this.highpassFilter);
      this.highpassFilter.connect(this.lowpassFilter);
      this.lowpassFilter.connect(this.analyser);
    } catch (e) {
      console.warn('DSP Audio Graph error:', e);
    }
  }

  /**
   * Start tracking real-time audio statistics & ambient noise floor
   */
  public startNoiseMonitoring(onUpdate: (stats: NoiseStats) => void) {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const checkLevel = () => {
      if (!this.analyser) return;

      this.analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const rawAvg = sum / dataArray.length;
      const normalizedVolume = Math.min(100, Math.round((rawAvg / 128) * 100));

      // Dynamically adapt noise floor
      if (normalizedVolume > 0 && normalizedVolume < 40) {
        this.noiseFloor = this.noiseFloor * this.smoothingFactor + normalizedVolume * (1 - this.smoothingFactor);
      }

      let status: NoiseStats['status'] = 'optimal';
      if (normalizedVolume < 5) {
        status = 'silent';
      } else if (this.noiseFloor > 35) {
        status = 'very_noisy';
      } else if (this.noiseFloor > 20) {
        status = 'noisy';
      }

      const isSpeaking = normalizedVolume > (this.noiseFloor + 10);

      onUpdate({
        volume: normalizedVolume,
        noiseFloor: Math.round(this.noiseFloor),
        status,
        isSpeaking
      });

      this.animFrameId = requestAnimationFrame(checkLevel);
    };

    checkLevel();
  }

  public stopNoiseMonitoring() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {
        // ignore
      }
      this.audioContext = null;
    }
  }

  public setShieldActive(active: boolean) {
    this.isShieldActive = active;
  }

  public isShieldEnabled(): boolean {
    return this.isShieldActive;
  }
}

export const noiseShield = new NoiseShieldProcessor();
