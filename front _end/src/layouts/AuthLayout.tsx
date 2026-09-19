import { Outlet, useLocation } from 'react-router-dom';
import { Utensils, ChefHat, Sparkles } from 'lucide-react';

export function AuthLayout() {
  const location = useLocation();
  const isRegister = location.pathname === '/register';

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex perspective-[2000px]">
      {/* Left Side - Branding with 3D effect */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-12 flex-col justify-between relative overflow-hidden"
        style={{
          transform: 'rotateY(-2deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Animated 3D decorative elements */}
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-float"
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 animate-float"
          style={{ animationDelay: '4s' }}
        ></div>

        <div className="relative z-10" style={{ transform: 'translateZ(50px)' }}>
          <div className="flex items-center space-x-3 mb-8 group">
            <div className="h-14 w-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6" style={{ transform: 'translateZ(30px)' }}>
              <Utensils className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Food Court</h1>
              <p className="text-indigo-200 text-sm">Management System</p>
            </div>
          </div>

          <div className="space-y-6 mt-16">
            <div className="flex items-start space-x-4 transform transition-all duration-500 hover:translate-x-2" style={{ transform: 'translateZ(20px)' }}>
              <div className="h-12 w-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Easy Order Management</h3>
                <p className="text-indigo-200 text-sm">Streamline your food court operations with our intuitive platform</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 transform transition-all duration-500 hover:translate-x-2" style={{ transform: 'translateZ(20px)' }}>
              <div className="h-12 w-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Real-time Updates</h3>
                <p className="text-indigo-200 text-sm">Track orders and manage your menu in real-time</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 transform transition-all duration-500 hover:translate-y-[-4px]" style={{ transform: 'translateZ(30px)' }}>
          <p className="text-indigo-200 text-sm">
            "This system has transformed how we manage our food court operations. Highly recommended!"
          </p>
          <p className="text-white font-medium mt-2">— Campus Food Services</p>
        </div>
      </div>

      {/* Right Side - Form with 3D depth */}
      <div className="flex-1 min-h-0 flex items-center justify-center overflow-y-auto p-8 lg:p-12">
        <div className="w-full max-w-md lg:max-w-lg">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="h-16 w-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform transition-all duration-500 hover:scale-110 hover:rotate-6">
              <Utensils className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="mb-8 transform transition-all duration-500 hover:translate-y-[-2px]">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {isRegister
                ? 'Join our food court management system today'
                : 'Sign in to access your dashboard'}
            </p>
          </div>

          <div
            className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-100 transform transition-all duration-500 hover:shadow-2xl"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              transform: 'translateZ(0)',
            }}
          >
            <Outlet />
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}