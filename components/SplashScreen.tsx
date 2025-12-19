// src/components/SplashScreen.tsx
'use client';

const logo = 'cap_logo.png';
export function SplashScreen() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
            <div className="w-[28rem] min-h-screen bg-white shadow-xl flex items-center justify-center p-6">
                <img
                    src={logo}
                    alt="App logo"
                    className="w-44 h-44 object-contain rounded-[40px] shadow-md"
                />
            </div>
        </div>
    );
}