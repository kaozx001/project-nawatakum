import React from 'react';
import './FeaturedBrands.css';

// Import Logos
import amdLogo from '../logo_image/AMD-Logo-1970-1990.jpg';
import appleLogo from '../logo_image/Apple-Logo.png';
import intelLogo from '../logo_image/Intel-Logo.png';
import logitechLogo from '../logo_image/logitech-gaming-logo-png-transparent-logitech-g-logo-11562915690slwbomsjym.png';
import razerLogo from '../logo_image/R.jpg';

function FeaturedBrands() {
    const brands = [
        { name: 'AMD', image: amdLogo },
        { name: 'Intel', image: intelLogo },
        { name: 'Razer', image: razerLogo },
        { name: 'Logitech', image: logitechLogo },
        { name: 'Apple', image: appleLogo },
        // Duplicating to ensure we have enough items for scrolling if needed, 
        // but user asked for "Infinite scroll". 
        // We need more items or repeat these. 
        // Let's add them again to the list itself to make the base list substantial.
        { name: 'AMD', image: amdLogo },
        { name: 'Intel', image: intelLogo },
        { name: 'Razer', image: razerLogo },
        { name: 'Logitech', image: logitechLogo },
        { name: 'Apple', image: appleLogo },
    ];

    return (
        <section className="brands">
            <div className="brands__container">
                <div className="brands__header">
                    <h2 className="brands__title">
                        Trusted by <span className="brands__title-accent">World-Class</span> Brands
                    </h2>
                    <p className="brands__subtitle">
                        เราเป็นตัวแทนจำหน่ายอย่างเป็นทางการจากแบรนด์ชั้นนำระดับโลก
                    </p>
                </div>

                <div className="brands__marquee">
                    <div className="brands__track">
                        {/* First set of brands */}
                        {brands.map((brand, index) => (
                            <div key={`brand-${index}`} className="brands__item">
                                <img src={brand.image} alt={brand.name} className="brands__logo-img" />
                                {/* Optional: Hide name if logo is sufficient, but user said "composition". 
                                    I'll keep name for clarity or remove if it looks cluttered. 
                                    Let's keep name for now as some logos might be obscure. 
                                    Actually, usually logos stand alone. Let's try logo + name side by side.
                                */}
                                <span className="brands__name">{brand.name}</span>
                            </div>
                        ))}
                        {/* Duplicate Key Set for infinite loop illusion (The CSS animates -50%) 
                            We need the TOTAL list to be duplicated once. 
                        */}
                        {brands.map((brand, index) => (
                            <div key={`brand-dupe-${index}`} className="brands__item">
                                <img src={brand.image} alt={brand.name} className="brands__logo-img" />
                                <span className="brands__name">{brand.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FeaturedBrands;
