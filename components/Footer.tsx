import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-gray-800 pb-12 mb-12">
          <div>
            <h4 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-6">HEADQUARTERS</h4>
            <div className="space-y-4 text-sm text-gray-300">
              <p className="font-bold text-white">Ceramiche Tân Gia Huy</p>
              <p>Via del Canaletto, 49, 41042<br />Fiorano Modenese MO<br />Italia</p>
              <p>Tel: +39 0536 817111</p>
            </div>
          </div>
          <div>
            <h4 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-6">TÂN GIA HUY USA</h4>
            <div className="space-y-4 text-sm text-gray-300">
              <p className="font-bold text-white">Tân Gia Huy Tiles USA, INC.</p>
              <p>500 Wilson Pike Cir, 37027<br />Brentwood TN<br />USA</p>
              <p>Tel: +1 (615) 986-1500</p>
            </div>
          </div>
          <div>
            <h4 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-6">URBAN LAB</h4>
            <div className="space-y-4 text-sm text-gray-300">
              <p className="font-bold text-white">Tân Gia Huy Urban Lab London</p>
              <p>17-18 Great Sutton Street, EC1V 0DP<br />London<br />UK</p>
              <p>Tel: +44 (0) 20 7836 4662</p>
            </div>
          </div>
          <div>
            <div className="space-y-4 text-sm text-gray-300 pt-8">
              <p className="font-bold text-white">Tân Gia Huy Urban Lab Paris</p>
              <p>10b, Rue Saint Nicolas, 75012<br />Paris<br />France</p>
              <p>Tel: +33 1 44 73 42 02</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-serif font-bold">TÂN GIA HUY</div>
            <div className="text-xs text-gray-500">
              <p>Tân Gia Huy S.p.A.</p>
              <p>Fiscal Code and VAT Code: P.iva: IT00179660360</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
            <a href="#" className="hover:text-white">Contacts</a>
            <a href="#" className="hover:text-white">General sales conditions</a>
            <a href="#" className="hover:text-white">Legal notes</a>
            <a href="#" className="hover:text-white">Group Policy – Health, Safety and Environment</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
