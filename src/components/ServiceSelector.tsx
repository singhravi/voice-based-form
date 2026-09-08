import React from 'react';
import { GOVT_SERVICES } from '../data/uttarakhandData';
import { Language, ServiceCategory } from '../types';
import {
  Award,
  Briefcase,
  Clock,
  FileCheck2,
  Home,
  IndianRupee,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface ServiceSelectorProps {
  selectedService: ServiceCategory;
  onSelectService: (service: ServiceCategory) => void;
  language: Language;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedService,
  onSelectService,
  language
}) => {
  const isHi = language === 'hi';

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className="w-5 h-5" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />;
      case 'Award':
        return <Award className="w-5 h-5" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5" />;
      default:
        return <FileCheck2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold">
              1
            </span>
            {isHi ? 'उत्तराखंड सरकारी सेवा का चयन करें' : 'Select Uttarakhand Govt. Service'}
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            {isHi
              ? 'जिस प्रमाण पत्र / योजना हेतु आवेदन करना है उस पर क्लिक करें'
              : 'Choose the certificate or scheme for which you wish to apply'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {GOVT_SERVICES.map((service) => {
          const isSelected = selectedService === service.id;
          return (
            <div
              key={service.id}
              onClick={() => onSelectService(service.id)}
              className={`relative cursor-pointer rounded-xl p-4 transition-all duration-200 border-2 ${
                isSelected
                  ? 'bg-gradient-to-br from-emerald-50 to-teal-50/50 border-emerald-600 shadow-md ring-2 ring-emerald-600/20'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 bg-emerald-600 text-white rounded-full p-1 shadow-sm">
                  <Sparkles size={12} />
                </div>
              )}

              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {getIcon(service.icon)}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-1">
                    {isHi ? service.nameHi : service.nameEn}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                    {isHi ? service.departmentHi : service.departmentEn}
                  </p>
                  
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {isHi ? service.descriptionHi : service.descriptionEn}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <IndianRupee size={12} />
                      {service.fee}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                      <Clock size={11} />
                      {service.deliveryDays} {isHi ? 'कार्यदिवस' : 'Days SLA'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
