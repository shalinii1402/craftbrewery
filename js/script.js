document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    // Calculate and set scrollbar width for fixed header alignment
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

    window.addEventListener('resize', () => {
        const sbWidth = window.innerWidth - document.documentElement.clientWidth;
        document.documentElement.style.setProperty('--scrollbar-width', `${sbWidth}px`);
    });

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        // Mobile Dropdown Toggle
        const dropdownItems = document.querySelectorAll('.nav-item');
        dropdownItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const menu = item.querySelector('.dropdown-menu');

            if (menu && link) {
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        const isCurrentlyShow = menu.classList.contains('show');

                        // Close ALL dropdowns first
                        document.querySelectorAll('.dropdown-menu').forEach(m => {
                            m.classList.remove('show');
                        });

                        // Toggle the clicked one
                        if (!isCurrentlyShow) {
                            menu.classList.add('show');
                        }
                    }
                });
            }
        });

        // Dynamic helper: Clone auth buttons to mobile menu if not already present
        if (!document.querySelector('.nav-links .mobile-auth-container')) {
            const authBtns = document.querySelectorAll('.auth-buttons .btn, .auth-buttons .btn-outline');
            if (authBtns.length > 0) {
                const mobileAuthDiv = document.createElement('div');
                mobileAuthDiv.className = 'mobile-auth-container';
                // Styles moved to CSS for responsive control

                authBtns.forEach(btn => {
                    const clone = btn.cloneNode(true);
                    // Clone styles moved to CSS
                    mobileAuthDiv.appendChild(clone);
                });

                navLinks.appendChild(mobileAuthDiv);
            }
        }
    }

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check saved theme and apply immediately
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        updateThemeIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });

        function updateThemeIcon(theme) {
            if (icon) {
                if (theme === 'dark') {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                } else {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            }
        }
    }

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.reveal-left, .pop-in');
    animatedElements.forEach(el => observer.observe(el));

    // Sticky Header Effect (Optional refinement)
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 5px 20px rgba(0,0,0,0.5)";
            header.style.padding = "0"; // Compact
        } else {
            header.style.boxShadow = "none";
            header.style.padding = "0"; // Original
        }
    });

    /* --- Product Details Page Logic --- */

    // Beer Database
    const beerData = {
        'golden-lager': {
            name: "Golden Lager",
            style: "Lager",
            abv: "5.0%",
            ibu: "20",
            image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Our Golden Lager is the definition of crisp and refreshing. Brewed with premium pilsner malt and noble Saaz hops, it delivers a clean, bready profile with a spicy, floral finish. Fermented cold and lagered for six weeks, clarify and balance are the stars of the show here.",
            ingredients: "Pilsner Malt, Saaz Hops, Lager Yeast, Water",
            notes: "Bready, Floral, Crisp, Clean",
            pairing: "Grilled Chicken, Pretzels, Seafood"
        },
        'copper-ale': {
            name: "Copper Ale",
            style: "Amber Ale",
            abv: "6.2%",
            ibu: "45",
            image: "https://images.unsplash.com/photo-1535958636474-b021ee8873a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "A rich, malt-forward ale that pours a beautiful deep amber. Notes of caramel, toffee, and toasted biscuits are balanced by a moderate hop bitterness from Cascade and Centennial hops. It's smooth, full-bodied, and perfect for cooler evenings.",
            ingredients: "2-Row Pale, Crystal 60, Cascade Hops, Ale Yeast",
            notes: "Caramel, Toffee, Pine, Citrus",
            pairing: "Burgers, BBQ Ribs, Cheddar Cheese"
        },
        'midnight-stout': {
            name: "Midnight Stout",
            style: "Imperial Stout",
            abv: "8.5%",
            ibu: "60",
            image: "https://images.unsplash.com/photo-1546270428-ec2f20ea7efb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Bold, dark, and mysteriously complex. This Imperial Stout features roasted barley and chocolate malt for intense flavors of espresso and dark chocolate. A creamy mouthfeel rounds out the experience, making it a dessert in a glass.",
            ingredients: "Roasted Barley, Chocolate Malt, Flaked Oats, English Hops",
            notes: "Espresso, Dark Chocolate, Roast, Creamy",
            pairing: "Steak, Chocolate Cake, Blue Cheese"
        },
        'hazy-ipa': {
            name: "Hazy IPA",
            style: "New England IPA",
            abv: "7.0%",
            ibu: "55",
            image: "https://images.unsplash.com/photo-1518176258769-f227c798150e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "A juice bomb of an IPA. We use massive amounts of Citra, Mosaic, and Galaxy hops in the dry hop to create intense aromas of mango, pineapple, and stone fruit. Low bitterness and a soft, pillowy mouthfeel make this incredibly drinkable.",
            ingredients: "Wheat, Oats, Citra & Mosaic Hops, London Fog Yeast",
            notes: "Mango, Pineapple, Juicy, Soft",
            pairing: "Spicy Tacos, Citrus Salad, Curry"
        },
        'berry-sour': {
            name: "Berry Sour",
            style: "Fruited Sour",
            abv: "4.5%",
            ibu: "10",
            image: "https://images.unsplash.com/photo-1615332579037-3c44b3660559?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Tart, tangy, and bursting with fruit. We age this kettle sour on hundreds of pounds of raspberries and blackberries. The result is a vibrant pink beer that strikes the perfect balance between sweet and sour.",
            ingredients: "Pilsner Malt, Wheat, Raspberries, Blackberries, Lactobacillus",
            notes: "Raspberry, Tart, Refreshing, Jammy",
            pairing: "Cheesecake, Goat Cheese, Summer Salad"
        },
        'pilsner': {
            name: "Classic Pilsner",
            style: "Czech Pilsner",
            abv: "5.2%",
            ibu: "30",
            image: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "A tribute to the original. This Czech-style Pilsner uses floor-malted bohemian barley and generous additions of Saaz hops. It's crisp, slightly spicy, and finishes with a clean bitterness that invites another sip.",
            ingredients: "Bohemian Floor Malt, Saaz Hops, Czech Lager Yeast",
            notes: "Spicy, Herbal, Cracker, crisp",
            pairing: "Sausages, Schnitzel, Mild Cheeses"
        },
        'hop-trail-ipa': {
            name: "Hop Trail IPA",
            style: "West Coast IPA",
            abv: "6.8%",
            ibu: "65",
            image: "https://images.unsplash.com/photo-1518176258769-f227c798150e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            description: "A bold, hop-forward IPA packed with citrus zest, pine aromas, and a clean bitter finish. Classic West Coast style.",
            ingredients: "Pale Malt, Caramel 20, Chinook, Simcoe, Cascade Hops",
            notes: "Pine, Citrus Zest, Resinous",
            pairing: "Spicy Curry, Fish Tacos"
        },
        'smoked-oak-porter': {
            name: "Smoked Oak Porter",
            style: "Porter",
            abv: "7.2%",
            ibu: "35",
            image: "https://images.pexels.com/photos/35028726/pexels-photo-35028726.jpeg",
            description: "Deep, smoky porter aged with oak, delivering rich chocolate, caramel, and roasted malt notes. Perfect for sipping by the fire.",
            ingredients: "Smoked Malt, Chocolate Malt, Oak Chips",
            notes: "Smoke, Chocolate, Oak, Vanilla",
            pairing: "Brisket, Smoked Cheese, Dark Chocolate"
        },
        'honey-wheat-ale': {
            name: "Honey Wheat Ale",
            style: "Wheat Ale",
            abv: "4.9%",
            ibu: "15",
            image: "https://images.pexels.com/photos/35743430/pexels-photo-35743430.jpeg",
            description: "Light-bodied and smooth with a touch of natural honey sweetness and a refreshing finish. An easy drinker for sunny days.",
            ingredients: "Wheat Malt, Local Honey, Hallertau Hops",
            notes: "Honey, Bread, Floral, Smooth",
            pairing: "Salads, Goat Cheese, Fruit Tart"
        }
    };

    // Check if we are on the product details page
    if (window.location.pathname.includes('product-details.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (productId && beerData[productId]) {
            const product = beerData[productId];

            // Populate Data
            document.title = `${product.name} | Copper Creek Brewery`;
            document.getElementById('product-img').src = product.image;
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-style').innerHTML = `<i class="fas fa-tag"></i> ${product.style}`;
            document.getElementById('product-abv').innerHTML = `<i class="fas fa-percent"></i> ${product.abv}`;
            document.getElementById('product-ibu').innerHTML = `<i class="fas fa-leaf"></i> ${product.ibu} IBU`;
            document.getElementById('product-desc').textContent = product.description;
            // Specs
            document.getElementById('product-ingredients').textContent = product.ingredients;
            document.getElementById('product-notes').textContent = product.notes;
            document.getElementById('product-pairing').textContent = product.pairing;

            // Generate Related Products (Specific Selection as Requested)
            const relatedContainer = document.getElementById('related-products');
            const selectedrelatedIds = ['hop-trail-ipa', 'smoked-oak-porter', 'honey-wheat-ale'];

            // Filter out current product if it's one of the selected ones
            const finalRelated = selectedrelatedIds.filter(id => id !== productId);

            finalRelated.forEach(id => {
                const relProduct = beerData[id];
                if (relProduct) {
                    const card = document.createElement('div');
                    card.className = 'card pop-in';
                    card.innerHTML = `
                        <img src="${relProduct.image}" alt="${relProduct.name}" style="width:100%; height: 250px; object-fit: cover; border-radius: 4px; margin-bottom: 20px;">
                        <h3>${relProduct.name}</h3>
                        <p style="color: #888; margin-bottom: 15px; font-size: 14px;">${relProduct.style}</p>
                         <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 700; color: var(--primary-color);">${relProduct.abv}</span>
                            <a href="product-details.html?id=${id}" class="btn btn-outline" style="padding: 8px 20px; font-size: 12px;">Details</a>
                        </div>
                   `;
                    relatedContainer.appendChild(card);
                    // Observe dynamically added cards for animation
                    if (typeof observer !== 'undefined') observer.observe(card);
                }
            });

        } else {
            // Fallback if ID invalid
            document.body.innerHTML = '<div class="container" style="padding-top: 150px; text-align: center;"><h1>Product Not Found</h1><a href="beers.html" class="btn">Back to Beers</a></div>';
        }
    }
});
