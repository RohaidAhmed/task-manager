import { useState, useEffect } from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';


const DarkAndLightBtn = () => {
    const [isDarkMode, setDarkMode] = useState(false);

    // Load saved theme from localStorage
    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    // Toggle class on <html> and save to localStorage
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = (checked: boolean) => {
        setDarkMode(checked);
    };

    return (
        <div className='text-xl md:text-2xl'>
            <DarkModeSwitch
                checked={isDarkMode}
                onChange={toggleDarkMode}
                size={30}
                sunColor="#facc15" // optional
                moonColor="#B3B9C4" // optional
                
            />
        </div>
    );
}

export default DarkAndLightBtn