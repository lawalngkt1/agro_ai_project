"""AI content generation utilities"""

def generate_crop_summary(crop_name, confidence):
    """Generate AI summary for crop recommendation"""
    return (
        f"Our AI analysis suggests that {crop_name.capitalize()} is the most suitable crop for your land, "
        f"with a confidence level of {confidence*100:.1f}%. This crop is highly resilient to the specific "
        f"nitrogen and rainfall patterns detected in your input. We recommend starting the planting cycle "
        f"within the next two weeks for optimal yield."
    )

def generate_crop_hausa(crop_name):
    """Generate Hausa summary for crop recommendation"""
    # Simple dictionary for crop names in Hausa if needed, or just use English names
    hausa_crops = {
        'rice': 'Shinkafa',
        'maize': 'Masara',
        'chickpea': 'Wake',
        'kidneybeans': 'Wake',
        'pigeonpeas': 'Wake',
        'mothbeans': 'Wake',
        'mungbean': 'Wake',
        'blackgram': 'Wake',
        'lentil': 'Wake',
        'pomegranate': 'Rumman',
        'banana': 'Ayaba',
        'mango': 'Mangwaro',
        'grapes': 'Inabi',
        'watermelon': 'Kankana',
        'muskmelon': 'Kankana',
        'apple': 'Tufa',
        'orange': 'Lemu',
        'papaya': 'Gwanda',
        'coconut': 'Kwarkwaro',
        'cotton': 'Auduga',
        'jute': 'Jute',
        'coffee': 'Kofi'
    }
    h_name = hausa_crops.get(crop_name.lower(), crop_name)
    return (
        f"Bincikenmu na AI ya nuna cewa {h_name} shine mafi dacewa ga filinku. "
        f"Wannan amfanin gona yana da juriya sosai ga yanayin ƙasa da kuka bayar. "
        f"Muna ba da shawarar fara shuka a cikin makonni biyu masu zuwa don samun sakamako mai kyau."
    )

def generate_soil_summary(soil_type, organic_matter):
    """Generate AI summary for soil analysis"""
    status = "rich" if organic_matter > 5 else "moderate" if organic_matter > 2 else "poor"
    return (
        f"Your soil has been classified as {soil_type}. The organic matter levels are {status}, "
        f"which significantly influences water retention and nutrient availability. To improve "
        f"productivity, focus on the specific recommendations provided in the report below."
    )

def generate_soil_hausa(soil_type):
    """Generate Hausa summary for soil analysis"""
    return (
        f"An rarraba ƙasarku a matsayin {soil_type}. Wannan nau'in ƙasar yana da tasiri sosai "
        f"wajen riƙe ruwa da wadatar abinci ga shuka. Don inganta amfanin gona, bi shawarwarin "
        f"da aka bayar a cikin wannan rahoton."
    )

def generate_plant_summary(disease, treatment):
    """Generate AI summary for plant disease"""
    if disease.lower() == 'healthy':
        return "Great news! Your plant appears to be healthy. No immediate action is required other than regular maintenance."
    return (
        f"Our Vision AI detected signs of {disease}. It is important to act quickly to prevent "
        f"the spread. Follow the treatment steps: {treatment}."
    )

def generate_plant_hausa(disease):
    """Generate Hausa summary for plant disease"""
    if disease.lower() == 'healthy':
        return "Labari mai daɗi! Shukarku tana da lafiya. Babu wani mataki da ya kamata a ɗauka sai dai kulawa ta yau da kullun."
    return (
        f"Vision AI ɗinmu ya gano alamun cutar {disease} a jikin shukarku. "
        f"Yana da mahimmanci a ɗauki mataki cikin sauri don hana yaɗuwar cutar."
    )
