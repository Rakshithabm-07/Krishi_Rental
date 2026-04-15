// ── KRISHI RENTAL – TRANSLATIONS ─────────────────────────────
// Covers: home page + dashboard (all roles)

const TRANSLATIONS = {

  en: {
    // NAV
    nav_home: 'Home', nav_about: 'About', nav_signup: 'Signup', nav_login: 'Login',

    // HERO
    hero_title: 'Krishi Rental System',
    hero_sub: 'Rent Agricultural Equipment Easily & Affordably',
    hero_btn_farmer: 'Register as Farmer',

    // FEATURES
    features_title: 'Why Choose Us?',
    feat1_title: 'Easy Rental', feat1_desc: 'Browse and rent equipment in minutes',
    feat2_title: 'Multi-Role System', feat2_desc: 'Admin, Producer, Farmer & QC roles',
    feat3_title: 'Secure Payments', feat3_desc: 'UPI & Card payment support',
    feat4_title: 'Multi-Language', feat4_desc: 'Available in English, Hindi & Kannada',

    // PREVIEW
    preview_title: 'Our Equipment',
    eq_tractor: 'Tractor', eq_harvester: 'Harvester', eq_sprayer: 'Sprayer', eq_thresher: 'Thresher',

    // ABOUT
    about_title: 'About Krishi Rental System',
    about_text: 'Krishi Rental System helps farmers rent agricultural equipment easily without buying costly machinery. We connect farmers with equipment producers, ensuring quality-checked returns and fair pricing.',

    // SIGNUP
    signup_farmer_title: '👨‍🌾 Farmer Registration',
    f_name: 'Full Name', f_email: 'Email', f_password: 'Password',
    f_confirm: 'Confirm Password', f_phone: 'Phone Number (10 digits)',
    f_aadhar: 'Aadhar Number', f_aadhar_img: 'Upload Aadhar Image',
    btn_register: 'Register',

    // LOGIN MODAL
    login_title: 'Login',
    login_role: 'Select Role',
    role_farmer: '👨‍🌾 Farmer', role_admin: '🛠️ Admin',
    role_producer: '🏭 Producer', role_qc: '✅ Quality Checker',
    login_email: 'Email', login_password: 'Password',
    btn_login: 'Login',

    // FOOTER
    footer_contact: '📞 +91-9999999999 | ✉️ support@krishi.com',
    footer_copy: '© 2026 Krishi Rental System. Developed for Indian Farmers.',

    // VALIDATION MESSAGES
    val_all_required: 'All fields are required',
    val_password_match: 'Passwords do not match',
    val_phone_digits: 'Phone must be 10 digits',
    val_login_fill: 'Enter email and password',
    val_login_failed: 'Invalid email or password',

    // DASHBOARD – SIDEBAR MENU LABELS
    menu_add_producer: '➕ Add Producer', menu_producers: '🏭 Producers', menu_customers: '👨‍🌾 Customers',
    menu_add_equipment: '➕ Add Equipment', menu_equipments: '🚜 Equipments',
    menu_alerts: '⏰ Alert Excess Time', menu_add_qc: '👷 Add QC Person', menu_view_qc: '👁 View QC',
    menu_all_eq: '🌾 All Equipments', menu_my_rentals: '📋 My Rentals',
    menu_qc_check: '✅ Quality Check',
    btn_logout: '🚪 Logout',

    // DASHBOARD – COMMON
    dash_submit: 'Submit', dash_save: '💾 Save Changes', dash_delete: '🗑 Delete',
    dash_update: '✏ Update', dash_rent: '🛒 RENT', dash_return: '↩ Return',
    dash_alert_btn: '🔔 Alert', dash_accept: '✅ Quality OK – Accept',
    dash_reject: '❌ Damaged >80% – Reject',
    dash_confirm_accept: '✅ Confirm Accept', dash_confirm_reject: '❌ Confirm Reject',
    dash_make_payment: '💳 Make Payment',

    // ADMIN PANELS
    admin_add_producer: 'Add New Producer',
    admin_producer_name: 'Producer / Company Name',
    admin_producer_email: 'Email', admin_producer_pass: 'Password',
    admin_producer_phone: 'Phone (10 digits)', admin_producer_addr: 'Full Address',
    admin_btn_add: 'Add Producer',
    admin_producers_title: 'All Producers',
    admin_farmers_title: 'Registered Farmers',
    col_name: 'Name', col_phone: 'Phone', col_email: 'Email',
    col_address: 'Address', col_action: 'Action', col_aadhar: 'Aadhar',

    // PRODUCER PANELS
    prod_add_eq_title: 'Add New Equipment',
    prod_eq_name: 'Equipment Name', prod_eq_used: 'Used For',
    prod_eq_rent: 'Rent / Day (₹)', prod_eq_qty: 'Quantity',
    prod_eq_max: 'Max Rental Days', prod_eq_dep: 'Safety Deposit (₹)',
    prod_eq_desc: 'Description', prod_eq_img: 'Equipment Image (JPG / PNG)',
    prod_btn_add_eq: 'Add Equipment',
    prod_my_eq: 'My Equipments',
    prod_add_qc_title: 'Add Quality Checker',
    prod_qc_name: 'Full Name', prod_qc_phone: 'Phone (10 digits)',
    prod_qc_email: 'Email', prod_qc_pass: 'Set login password',
    prod_btn_add_qc: 'Add QC Person',
    prod_qc_team: 'QC Team',
    prod_overdue_title: 'Overdue Rentals',
    prod_no_overdue: '✅ No overdue rentals right now!',

    // FARMER PANELS
    farm_all_eq: 'All Equipments',
    farm_no_eq: 'No equipment available right now.',
    farm_by: 'By:', farm_available: 'Available:',
    farm_max: 'Max:', farm_deposit: 'Deposit:', farm_per_day: '/ day',
    farm_rent_modal: 'Rent Equipment',
    farm_from: 'From Date', farm_to: 'To Date',
    farm_sel_days: 'Selected Days (max', farm_rent_total: 'Rent Total',
    farm_total: 'Total (incl. deposit)', farm_pay_mode: 'Payment Mode',
    farm_upi: '📱 UPI', farm_card: '💳 Card',
    farm_upi_id: 'UPI ID', farm_card_no: 'Card Number', farm_cvv: 'CVV',
    farm_terms: 'I accept the Terms & Conditions',
    farm_processing: '⏳ Your transaction is in process, please wait… don\'t refresh the page',
    farm_my_rentals: 'My Rentals',
    farm_no_rentals: 'You have no rentals yet. Go to "All Equipments" to rent one!',
    farm_from_col: 'From', farm_to_col: 'To', farm_max_col: 'Max Days',
    farm_days_col: 'Days', farm_dep_col: 'Deposit', farm_rent_col: 'Rent Total',
    farm_total_col: 'Total', farm_status_col: 'Status', farm_action_col: 'Action',

    // STATUS
    status_in_rent: 'In Rent', status_in_qc: 'In QC',
    status_returned: 'Returned', status_rejected: 'Rejected',
    status_processing: '⏳ Processing',

    // QC PANEL
    qc_title: 'Quality Check',
    qc_pending: 'Pending QC',
    qc_no_items: '✅ No items in QC queue right now.',
    qc_farmer: 'Farmer', qc_to_date: 'To Date',
    qc_current: 'Current Date', qc_delay_days: 'Delay Days',
    qc_delay_fine: 'Delay Fine (₹200/day)',
    qc_damage_fine: 'Damage Fine (₹) — Enter 0 if none',
    qc_return_amt: 'Returning Amount to Farmer',
    qc_formula: 'Formula: Deposit − Delay Fine − Damage Fine = Returning Amount',
  },

  // ────────────────────────────────────────────────────────────
  hi: {
    nav_home: 'होम', nav_about: 'हमारे बारे में', nav_signup: 'साइनअप', nav_login: 'लॉगिन',
    hero_title: 'कृषि रेंटल सिस्टम',
    hero_sub: 'कृषि उपकरण आसानी से और किफायती दर पर किराए पर लें',
    hero_btn_farmer: 'किसान के रूप में पंजीकरण करें',
    features_title: 'हमें क्यों चुनें?',
    feat1_title: 'आसान किराया', feat1_desc: 'मिनटों में उपकरण ब्राउज़ और किराए पर लें',
    feat2_title: 'बहु-भूमिका प्रणाली', feat2_desc: 'एडमिन, उत्पादक, किसान और QC भूमिकाएं',
    feat3_title: 'सुरक्षित भुगतान', feat3_desc: 'UPI और कार्ड भुगतान समर्थन',
    feat4_title: 'बहु-भाषा', feat4_desc: 'अंग्रेजी, हिंदी और कन्नड़ में उपलब्ध',
    preview_title: 'हमारे उपकरण',
    eq_tractor: 'ट्रैक्टर', eq_harvester: 'हार्वेस्टर', eq_sprayer: 'स्प्रेयर', eq_thresher: 'थ्रेशर',
    about_title: 'कृषि रेंटल सिस्टम के बारे में',
    about_text: 'कृषि रेंटल सिस्टम किसानों को महंगी मशीनरी खरीदे बिना कृषि उपकरण आसानी से किराए पर लेने में मदद करता है।',
    signup_farmer_title: '👨‍🌾 किसान पंजीकरण',
    f_name: 'पूरा नाम', f_email: 'ईमेल', f_password: 'पासवर्ड',
    f_confirm: 'पासवर्ड की पुष्टि करें', f_phone: 'फोन नंबर (10 अंक)',
    f_aadhar: 'आधार नंबर', f_aadhar_img: 'आधार छवि अपलोड करें',
    btn_register: 'पंजीकरण करें',
    login_title: 'लॉगिन', login_role: 'भूमिका चुनें',
    role_farmer: '👨‍🌾 किसान', role_admin: '🛠️ एडमिन',
    role_producer: '🏭 उत्पादक', role_qc: '✅ गुणवत्ता जांचकर्ता',
    login_email: 'ईमेल', login_password: 'पासवर्ड', btn_login: 'लॉगिन करें',
    footer_contact: '📞 +91-9999999999 | ✉️ support@krishi.com',
    footer_copy: '© 2026 कृषि रेंटल सिस्टम। भारतीय किसानों के लिए।',
    val_all_required: 'सभी फ़ील्ड आवश्यक हैं',
    val_password_match: 'पासवर्ड मेल नहीं खाते',
    val_phone_digits: 'फोन 10 अंकों का होना चाहिए',
    val_login_fill: 'ईमेल और पासवर्ड दर्ज करें',
    val_login_failed: 'गलत ईमेल या पासवर्ड',
    menu_add_producer: '➕ उत्पादक जोड़ें', menu_producers: '🏭 उत्पादक', menu_customers: '👨‍🌾 ग्राहक',
    menu_add_equipment: '➕ उपकरण जोड़ें', menu_equipments: '🚜 उपकरण',
    menu_alerts: '⏰ अधिक समय अलर्ट', menu_add_qc: '👷 QC व्यक्ति जोड़ें', menu_view_qc: '👁 QC देखें',
    menu_all_eq: '🌾 सभी उपकरण', menu_my_rentals: '📋 मेरे किराए',
    menu_qc_check: '✅ गुणवत्ता जांच', btn_logout: '🚪 लॉगआउट',
    dash_submit: 'जमा करें', dash_save: '💾 बदलाव सहेजें', dash_delete: '🗑 हटाएं',
    dash_update: '✏ अपडेट', dash_rent: '🛒 किराए पर लें', dash_return: '↩ वापस करें',
    dash_alert_btn: '🔔 अलर्ट', dash_accept: '✅ गुणवत्ता ठीक – स्वीकार करें',
    dash_reject: '❌ 80% से अधिक क्षतिग्रस्त – अस्वीकार',
    dash_confirm_accept: '✅ स्वीकार करें', dash_confirm_reject: '❌ अस्वीकार करें',
    dash_make_payment: '💳 भुगतान करें',
    admin_add_producer: 'नया उत्पादक जोड़ें',
    admin_producer_name: 'उत्पादक / कंपनी का नाम',
    admin_producer_email: 'ईमेल', admin_producer_pass: 'पासवर्ड',
    admin_producer_phone: 'फोन (10 अंक)', admin_producer_addr: 'पूरा पता',
    admin_btn_add: 'उत्पादक जोड़ें',
    admin_producers_title: 'सभी उत्पादक',
    admin_farmers_title: 'पंजीकृत किसान',
    col_name: 'नाम', col_phone: 'फोन', col_email: 'ईमेल',
    col_address: 'पता', col_action: 'कार्रवाई', col_aadhar: 'आधार',
    prod_add_eq_title: 'नया उपकरण जोड़ें',
    prod_eq_name: 'उपकरण का नाम', prod_eq_used: 'उपयोग के लिए',
    prod_eq_rent: 'किराया / दिन (₹)', prod_eq_qty: 'मात्रा',
    prod_eq_max: 'अधिकतम किराए के दिन', prod_eq_dep: 'सुरक्षा जमा (₹)',
    prod_eq_desc: 'विवरण', prod_eq_img: 'उपकरण छवि (JPG / PNG)',
    prod_btn_add_eq: 'उपकरण जोड़ें', prod_my_eq: 'मेरे उपकरण',
    prod_add_qc_title: 'गुणवत्ता जांचकर्ता जोड़ें',
    prod_qc_name: 'पूरा नाम', prod_qc_phone: 'फोन (10 अंक)',
    prod_qc_email: 'ईमेल', prod_qc_pass: 'लॉगिन पासवर्ड सेट करें',
    prod_btn_add_qc: 'QC व्यक्ति जोड़ें', prod_qc_team: 'QC टीम',
    prod_overdue_title: 'अतिदेय किराए', prod_no_overdue: '✅ अभी कोई अतिदेय किराया नहीं!',
    farm_all_eq: 'सभी उपकरण', farm_no_eq: 'अभी कोई उपकरण उपलब्ध नहीं।',
    farm_by: 'द्वारा:', farm_available: 'उपलब्ध:', farm_max: 'अधिकतम:',
    farm_deposit: 'जमा:', farm_per_day: '/ दिन',
    farm_rent_modal: 'उपकरण किराए पर लें',
    farm_from: 'प्रारंभ तिथि', farm_to: 'समाप्ति तिथि',
    farm_sel_days: 'चुने गए दिन (अधिकतम',
    farm_rent_total: 'किराया कुल', farm_total: 'कुल (जमा सहित)',
    farm_pay_mode: 'भुगतान का तरीका',
    farm_upi: '📱 UPI', farm_card: '💳 कार्ड',
    farm_upi_id: 'UPI ID', farm_card_no: 'कार्ड नंबर', farm_cvv: 'CVV',
    farm_terms: 'मैं नियम और शर्तें स्वीकार करता/करती हूं',
    farm_processing: '⏳ लेन-देन प्रक्रिया में है, कृपया प्रतीक्षा करें…',
    farm_my_rentals: 'मेरे किराए', farm_no_rentals: 'अभी तक कोई किराया नहीं। उपकरण किराए पर लेने के लिए जाएं!',
    farm_from_col: 'से', farm_to_col: 'तक', farm_max_col: 'अधिकतम दिन',
    farm_days_col: 'दिन', farm_dep_col: 'जमा', farm_rent_col: 'किराया कुल',
    farm_total_col: 'कुल', farm_status_col: 'स्थिति', farm_action_col: 'कार्रवाई',
    status_in_rent: 'किराए पर', status_in_qc: 'QC में',
    status_returned: 'वापस किया', status_rejected: 'अस्वीकृत',
    status_processing: '⏳ प्रक्रिया में',
    qc_title: 'गुणवत्ता जांच', qc_pending: 'QC लंबित',
    qc_no_items: '✅ अभी QC कतार में कोई आइटम नहीं।',
    qc_farmer: 'किसान', qc_to_date: 'समाप्ति तिथि',
    qc_current: 'वर्तमान तिथि', qc_delay_days: 'विलंब दिन',
    qc_delay_fine: 'विलंब जुर्माना (₹200/दिन)',
    qc_damage_fine: 'क्षति जुर्माना (₹) — यदि कोई नहीं तो 0',
    qc_return_amt: 'किसान को वापसी राशि',
    qc_formula: 'सूत्र: जमा − विलंब जुर्माना − क्षति जुर्माना = वापसी राशि',
  },

  // ────────────────────────────────────────────────────────────
  kn: {
    nav_home: 'ಮುಖಪುಟ', nav_about: 'ನಮ್ಮ ಬಗ್ಗೆ', nav_signup: 'ಸೈನ್ಅಪ್', nav_login: 'ಲಾಗಿನ್',
    hero_title: 'ಕೃಷಿ ರೆಂಟಲ್ ಸಿಸ್ಟಮ್',
    hero_sub: 'ಕೃಷಿ ಉಪಕರಣಗಳನ್ನು ಸುಲಭವಾಗಿ ಮತ್ತು ಕೈಗೆಟಕುವ ದರದಲ್ಲಿ ಬಾಡಿಗೆಗೆ ತೆಗೆದುಕೊಳ್ಳಿ',
    hero_btn_farmer: 'ರೈತರಾಗಿ ನೋಂದಣಿ ಮಾಡಿ',
    features_title: 'ನಮ್ಮನ್ನು ಏಕೆ ಆರಿಸಬೇಕು?',
    feat1_title: 'ಸುಲಭ ಬಾಡಿಗೆ', feat1_desc: 'ನಿಮಿಷಗಳಲ್ಲಿ ಉಪಕರಣ ಬ್ರೌಸ್ ಮಾಡಿ ಬಾಡಿಗೆ ತೆಗೆಯಿರಿ',
    feat2_title: 'ಬಹು-ಪಾತ್ರ ವ್ಯವಸ್ಥೆ', feat2_desc: 'ಅಡ್ಮಿನ್, ಉತ್ಪಾದಕ, ರೈತ ಮತ್ತು QC ಪಾತ್ರಗಳು',
    feat3_title: 'ಸುರಕ್ಷಿತ ಪಾವತಿ', feat3_desc: 'UPI ಮತ್ತು ಕಾರ್ಡ್ ಪಾವತಿ ಬೆಂಬಲ',
    feat4_title: 'ಬಹು-ಭಾಷೆ', feat4_desc: 'ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ ಮತ್ತು ಕನ್ನಡದಲ್ಲಿ ಲಭ್ಯ',
    preview_title: 'ನಮ್ಮ ಉಪಕರಣಗಳು',
    eq_tractor: 'ಟ್ರ್ಯಾಕ್ಟರ್', eq_harvester: 'ಕೊಯ್ಲು ಯಂತ್ರ', eq_sprayer: 'ಸ್ಪ್ರೇಯರ್', eq_thresher: 'ಥ್ರೆಶರ್',
    about_title: 'ಕೃಷಿ ರೆಂಟಲ್ ಸಿಸ್ಟಮ್ ಬಗ್ಗೆ',
    about_text: 'ಕೃಷಿ ರೆಂಟಲ್ ಸಿಸ್ಟಮ್ ರೈತರಿಗೆ ದುಬಾರಿ ಯಂತ್ರೋಪಕರಣ ಖರೀದಿಸದೆ ಕೃಷಿ ಉಪಕರಣಗಳನ್ನು ಸುಲಭವಾಗಿ ಬಾಡಿಗೆಗೆ ಪಡೆಯಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
    signup_farmer_title: '👨‍🌾 ರೈತ ನೋಂದಣಿ',
    f_name: 'ಪೂರ್ಣ ಹೆಸರು', f_email: 'ಇಮೇಲ್', f_password: 'ಪಾಸ್‌ವರ್ಡ್',
    f_confirm: 'ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ', f_phone: 'ಫೋನ್ ಸಂಖ್ಯೆ (10 ಅಂಕೆಗಳು)',
    f_aadhar: 'ಆಧಾರ್ ಸಂಖ್ಯೆ', f_aadhar_img: 'ಆಧಾರ್ ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    btn_register: 'ನೋಂದಣಿ ಮಾಡಿ',
    login_title: 'ಲಾಗಿನ್', login_role: 'ಪಾತ್ರ ಆಯ್ಕೆ ಮಾಡಿ',
    role_farmer: '👨‍🌾 ರೈತ', role_admin: '🛠️ ಅಡ್ಮಿನ್',
    role_producer: '🏭 ಉತ್ಪಾದಕ', role_qc: '✅ ಗುಣಮಟ್ಟ ಪರೀಕ್ಷಕ',
    login_email: 'ಇಮೇಲ್', login_password: 'ಪಾಸ್‌ವರ್ಡ್', btn_login: 'ಲಾಗಿನ್ ಮಾಡಿ',
    footer_contact: '📞 +91-9999999999 | ✉️ support@krishi.com',
    footer_copy: '© 2026 ಕೃಷಿ ರೆಂಟಲ್ ಸಿಸ್ಟಮ್. ಭಾರತೀಯ ರೈತರಿಗಾಗಿ.',
    val_all_required: 'ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳು ಅಗತ್ಯ',
    val_password_match: 'ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತಿಲ್ಲ',
    val_phone_digits: 'ಫೋನ್ 10 ಅಂಕೆಗಳಾಗಿರಬೇಕು',
    val_login_fill: 'ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ',
    val_login_failed: 'ತಪ್ಪಾದ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್',
    menu_add_producer: '➕ ಉತ್ಪಾದಕ ಸೇರಿಸಿ', menu_producers: '🏭 ಉತ್ಪಾದಕರು', menu_customers: '👨‍🌾 ಗ್ರಾಹಕರು',
    menu_add_equipment: '➕ ಉಪಕರಣ ಸೇರಿಸಿ', menu_equipments: '🚜 ಉಪಕರಣಗಳು',
    menu_alerts: '⏰ ಹೆಚ್ಚು ಸಮಯ ಎಚ್ಚರಿಕೆ', menu_add_qc: '👷 QC ವ್ಯಕ್ತಿ ಸೇರಿಸಿ', menu_view_qc: '👁 QC ನೋಡಿ',
    menu_all_eq: '🌾 ಎಲ್ಲಾ ಉಪಕರಣಗಳು', menu_my_rentals: '📋 ನನ್ನ ಬಾಡಿಗೆಗಳು',
    menu_qc_check: '✅ ಗುಣಮಟ್ಟ ತಪಾಸಣೆ', btn_logout: '🚪 ಲಾಗ್‌ಔಟ್',
    dash_submit: 'ಸಲ್ಲಿಸಿ', dash_save: '💾 ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ', dash_delete: '🗑 ಅಳಿಸಿ',
    dash_update: '✏ ನವೀಕರಿಸಿ', dash_rent: '🛒 ಬಾಡಿಗೆ', dash_return: '↩ ಹಿಂತಿರುಗಿಸಿ',
    dash_alert_btn: '🔔 ಎಚ್ಚರಿಕೆ', dash_accept: '✅ ಗುಣಮಟ್ಟ ಸರಿ – ಸ್ವೀಕರಿಸಿ',
    dash_reject: '❌ 80%+ ಹಾನಿ – ತಿರಸ್ಕರಿಸಿ',
    dash_confirm_accept: '✅ ಸ್ವೀಕರಿಸಿ', dash_confirm_reject: '❌ ತಿರಸ್ಕರಿಸಿ',
    dash_make_payment: '💳 ಪಾವತಿ ಮಾಡಿ',
    admin_add_producer: 'ಹೊಸ ಉತ್ಪಾದಕರನ್ನು ಸೇರಿಸಿ',
    admin_producer_name: 'ಉತ್ಪಾದಕ / ಕಂಪನಿ ಹೆಸರು',
    admin_producer_email: 'ಇಮೇಲ್', admin_producer_pass: 'ಪಾಸ್‌ವರ್ಡ್',
    admin_producer_phone: 'ಫೋನ್ (10 ಅಂಕೆಗಳು)', admin_producer_addr: 'ಪೂರ್ಣ ವಿಳಾಸ',
    admin_btn_add: 'ಉತ್ಪಾದಕ ಸೇರಿಸಿ',
    admin_producers_title: 'ಎಲ್ಲಾ ಉತ್ಪಾದಕರು',
    admin_farmers_title: 'ನೋಂದಾಯಿತ ರೈತರು',
    col_name: 'ಹೆಸರು', col_phone: 'ಫೋನ್', col_email: 'ಇಮೇಲ್',
    col_address: 'ವಿಳಾಸ', col_action: 'ಕ್ರಿಯೆ', col_aadhar: 'ಆಧಾರ್',
    prod_add_eq_title: 'ಹೊಸ ಉಪಕರಣ ಸೇರಿಸಿ',
    prod_eq_name: 'ಉಪಕರಣ ಹೆಸರು', prod_eq_used: 'ಉಪಯೋಗಕ್ಕಾಗಿ',
    prod_eq_rent: 'ಬಾಡಿಗೆ / ದಿನ (₹)', prod_eq_qty: 'ಪ್ರಮಾಣ',
    prod_eq_max: 'ಗರಿಷ್ಠ ಬಾಡಿಗೆ ದಿನಗಳು', prod_eq_dep: 'ಭದ್ರತಾ ಠೇವಣಿ (₹)',
    prod_eq_desc: 'ವಿವರಣೆ', prod_eq_img: 'ಉಪಕರಣ ಚಿತ್ರ (JPG / PNG)',
    prod_btn_add_eq: 'ಉಪಕರಣ ಸೇರಿಸಿ', prod_my_eq: 'ನನ್ನ ಉಪಕರಣಗಳು',
    prod_add_qc_title: 'ಗುಣಮಟ್ಟ ಪರೀಕ್ಷಕ ಸೇರಿಸಿ',
    prod_qc_name: 'ಪೂರ್ಣ ಹೆಸರು', prod_qc_phone: 'ಫೋನ್ (10 ಅಂಕೆಗಳು)',
    prod_qc_email: 'ಇಮೇಲ್', prod_qc_pass: 'ಲಾಗಿನ್ ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಿಸಿ',
    prod_btn_add_qc: 'QC ವ್ಯಕ್ತಿ ಸೇರಿಸಿ', prod_qc_team: 'QC ತಂಡ',
    prod_overdue_title: 'ಅವಧಿ ಮೀರಿದ ಬಾಡಿಗೆಗಳು', prod_no_overdue: '✅ ಈಗ ಯಾವುದೇ ಅವಧಿ ಮೀರಿದ ಬಾಡಿಗೆ ಇಲ್ಲ!',
    farm_all_eq: 'ಎಲ್ಲಾ ಉಪಕರಣಗಳು', farm_no_eq: 'ಈಗ ಯಾವುದೇ ಉಪಕರಣ ಲಭ್ಯವಿಲ್ಲ.',
    farm_by: 'ಮೂಲಕ:', farm_available: 'ಲಭ್ಯ:', farm_max: 'ಗರಿಷ್ಠ:',
    farm_deposit: 'ಠೇವಣಿ:', farm_per_day: '/ ದಿನ',
    farm_rent_modal: 'ಉಪಕರಣ ಬಾಡಿಗೆಗೆ ತೆಗೆದುಕೊಳ್ಳಿ',
    farm_from: 'ಪ್ರಾರಂಭ ದಿನಾಂಕ', farm_to: 'ಮುಕ್ತಾಯ ದಿನಾಂಕ',
    farm_sel_days: 'ಆಯ್ಕೆ ಮಾಡಿದ ದಿನಗಳು (ಗರಿಷ್ಠ',
    farm_rent_total: 'ಬಾಡಿಗೆ ಒಟ್ಟು', farm_total: 'ಒಟ್ಟು (ಠೇವಣಿ ಸೇರಿ)',
    farm_pay_mode: 'ಪಾವತಿ ವಿಧಾನ',
    farm_upi: '📱 UPI', farm_card: '💳 ಕಾರ್ಡ್',
    farm_upi_id: 'UPI ID', farm_card_no: 'ಕಾರ್ಡ್ ಸಂಖ್ಯೆ', farm_cvv: 'CVV',
    farm_terms: 'ನಾನು ನಿಯಮ ಮತ್ತು ಷರತ್ತುಗಳನ್ನು ಒಪ್ಪುತ್ತೇನೆ',
    farm_processing: '⏳ ವ್ಯವಹಾರ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ, ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ…',
    farm_my_rentals: 'ನನ್ನ ಬಾಡಿಗೆಗಳು', farm_no_rentals: 'ಇನ್ನೂ ಯಾವುದೇ ಬಾಡಿಗೆ ಇಲ್ಲ. ಉಪಕರಣ ಬಾಡಿಗೆಗೆ ತೆಗೆಯಿರಿ!',
    farm_from_col: 'ಇಂದ', farm_to_col: 'ವರೆಗೆ', farm_max_col: 'ಗರಿಷ್ಠ ದಿನಗಳು',
    farm_days_col: 'ದಿನಗಳು', farm_dep_col: 'ಠೇವಣಿ', farm_rent_col: 'ಬಾಡಿಗೆ ಒಟ್ಟು',
    farm_total_col: 'ಒಟ್ಟು', farm_status_col: 'ಸ್ಥಿತಿ', farm_action_col: 'ಕ್ರಿಯೆ',
    status_in_rent: 'ಬಾಡಿಗೆಯಲ್ಲಿ', status_in_qc: 'QC ನಲ್ಲಿ',
    status_returned: 'ಹಿಂತಿರುಗಿಸಲಾಗಿದೆ', status_rejected: 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ',
    status_processing: '⏳ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ',
    qc_title: 'ಗುಣಮಟ್ಟ ತಪಾಸಣೆ', qc_pending: 'ಬಾಕಿ QC',
    qc_no_items: '✅ ಈಗ QC ಸರತಿಯಲ್ಲಿ ಯಾವುದೂ ಇಲ್ಲ.',
    qc_farmer: 'ರೈತ', qc_to_date: 'ಮುಕ್ತಾಯ ದಿನಾಂಕ',
    qc_current: 'ಇಂದಿನ ದಿನಾಂಕ', qc_delay_days: 'ವಿಳಂಬ ದಿನಗಳು',
    qc_delay_fine: 'ವಿಳಂಬ ದಂಡ (₹200/ದಿನ)',
    qc_damage_fine: 'ಹಾನಿ ದಂಡ (₹) — ಇಲ್ಲದಿದ್ದರೆ 0',
    qc_return_amt: 'ರೈತರಿಗೆ ಮರುಪಾವತಿ ಮೊತ್ತ',
    qc_formula: 'ಸೂತ್ರ: ಠೇವಣಿ − ವಿಳಂಬ ದಂಡ − ಹಾನಿ ದಂಡ = ಮರುಪಾವತಿ',
  }
};

// ── Current language (persisted in localStorage) ─────────────
let currentLang = localStorage.getItem('krishi_lang') || 'en';

function t(key) {
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key])
      || TRANSLATIONS['en'][key]
      || key;
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('krishi_lang', lang);

  // Update every element that has a data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val;
    } else if (el.tagName === 'OPTION') {
      el.textContent = val;
    } else {
      el.textContent = val;
    }
  });

  // Update lang selector to match
  const sel = document.getElementById('langSelect');
  if (sel) sel.value = lang;
}

function changeLanguage(lang) {
  applyLanguage(lang);
}
