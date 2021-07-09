
let types = ["Bodyweight", "Gym", "Outdoor", "Athlete", "Mobility", "Endurance"]; 
let levels = ["Lannister / Targaryen", "Beginner", "Advanced", "Pro", "Stark"];
let goalsArr = ["Get summer fit", "Run a marathon", "Become more athletic", "Improve endurance", "Lose weight", "Build muscle"];
let intensities = ["Low", "Medium", "High"];
let unitTypes = ["Reps", "Minutes", "Meter", "Km"];
let equipments = ["None (bodyweight exercise)", "Barbell", "Dumbell",  "Kettlebell", "SwissBal", "Bench", "Gym mat", "Incline Bench", "Pull-up bar", "SZ-Bar"]
let muscles  = [`I haven't the faintest idea`,'Anterior deltoid','Biceps brachii','Bicpes femoris','Brachialis','Gastrocnemius','Gluteus maximus','Latissimus dorsi','Obliquus externus abdominis','Pectoralis major','Quadriceps femoris','Rectus abdominis','Serratus anterior','Soleus','Trapezius','Triceps brachii','Erector spinae','Gastrocnemius'];
let defaultDuration = 10;
let defaultReps = 10;
let defaultSets = 3;
let defaultRestBetweenSets = 60;
let defaultRestBetweenExercises = 120;


module.exports = {
    types, 
    levels, 
    goalsArr, 
    intensities, 
    unitTypes, 
    equipments, 
    muscles, 
    defaultDuration, 
    defaultReps, 
    defaultSets, 
    defaultRestBetweenSets, 
    defaultRestBetweenExercises
}