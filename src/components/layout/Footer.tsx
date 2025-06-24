
import { Link } from "react-router-dom";
import { Shield, FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 mt-12 py-6 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-slate-600">
              © 2024 SB2coach.ai - Transformação inteligente
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/privacy-policy"
              className="text-sm text-slate-600 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              Privacidade
            </Link>
            <Link 
              to="/terms-of-service"
              className="text-sm text-slate-600 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <FileText className="w-3 h-3" />
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
