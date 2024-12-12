import React, { useState } from 'react';
import { Menu, X, ScanFace, Search, LogIn, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationCenter } from './admin/NotificationCenter';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitch } from './LanguageSwitch';
import { Link } from 'react-router-dom';

const navLinkStyles = "hover:text-yellow-400 transition-colors text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-yellow-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-center";
const mobileNavLinkStyles = "px-4 py-2 hover:bg-orange-600 transition-colors text-sm font-medium rounded-lg";
const buttonBaseStyles = "flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105";
const secondaryButtonStyles = "bg-orange-600 text-white hover:bg-orange-700";
const outlineButtonStyles = "border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-orange-900";
const mobileSecondaryButtonStyles = "flex items-center justify-center w-full bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-orange-700 transition-colors";
const mobileOutlineButtonStyles = "flex items-center justify-center w-full border-2 border-yellow-400 text-yellow-400 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-400 hover:text-orange-900 transition-colors";

export const Header = ({
  onTrack,
}: {
  onTrack: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky w-full z-50 bg-gradient-to-r from-orange-800 via-orange-700 to-orange-800 text-white border-b-4 border-yellow-500 shadow-lg">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <ScanFace className="h-8 w-8 text-yellow-400" />
            <div>
              <span className="text-xl font-bold">{t('simhastha')}</span>
              <span className="text-sm block text-yellow-400">{t('simhastha_tracker')}</span>
            </div>
          </motion.div>

          <div className="hidden md:flex items-center space-x-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-6"
            >
              <a href="#reports" className={navLinkStyles}>{t('reports')}</a>
              <a href="#stations" className={navLinkStyles}>{t('stations')}</a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <LanguageSwitch />
              <NotificationCenter />
              <button
                onClick={onTrack}
                className={`${buttonBaseStyles} ${secondaryButtonStyles}`}
              >
                <Search className="w-4 h-4 mr-2" />
                {t('track_case')}
              </button>
            
              <Link to={"/admin"}
                className={`${buttonBaseStyles} ${outlineButtonStyles}`}>
                  <LogIn className="w-4 h-4 mr-2" />
                  admin_login
              </Link>
            </motion.div>
          </div>

          <button
            className="md:hidden text-yellow-400 hover:text-yellow-300 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-orange-600 overflow-hidden"
            >
              <div className="flex flex-col space-y-3 py-4">
                <a href="#reports" className={mobileNavLinkStyles}>{t('reports')}</a>
                <a href="#stations" className={mobileNavLinkStyles}>{t('stations')}</a>
                <LanguageSwitch />
                <button
                  onClick={onTrack}
                  className={mobileSecondaryButtonStyles}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {t('track_case')}
                </button>
                <button
                  onClick={onAdminLogin}
                  className={mobileOutlineButtonStyles}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {t('admin_login')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};