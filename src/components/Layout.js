import React from 'react';
import App from './App';
import '../styles/App.css';

const Layout = () => {
    return (
        <div className="app">
            <header>
                <h1>Kwota słownie</h1>
            </header>
            <main>
                <section className="converter">
                    <App />
                </section>
            </main>
            <footer>
                <p>&copy; 2019, created by <span>Radosław Kołodziejczyk</span></p>
            </footer>
        </div>
    );
}

export default Layout;