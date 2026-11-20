// Ready-made programs. Each exercise is { name, sets, reps } (for Plank, reps means seconds).
const L = (name, sets, reps) => ({ name, sets, reps })
export const PROGRAMS = [
  { id: 'fullbody', name: 'Full body starter', level: 'Beginner', days: '3 days a week', blurb: 'Alternate A and B. Simple to learn, hard to outgrow.', workouts: [
    { id: 'fb-a', name: 'Full body A', minutes: 50, exercises: [L('Back Squat', 3, 8), L('Bench Press', 3, 8), L('Barbell Row', 3, 8), L('Overhead Press', 2, 10), L('Plank', 3, 30)] },
    { id: 'fb-b', name: 'Full body B', minutes: 50, exercises: [L('Deadlift', 3, 5), L('Incline Bench Press', 3, 8), L('Lat Pulldown', 3, 10), L('Lunge', 3, 10), L('Dumbbell Curl', 2, 12)] } ] },
  { id: 'ppl', name: 'Push, pull, legs', level: 'Intermediate', days: '3 to 6 days a week', blurb: 'Split by movement. Run it once or twice a week.', workouts: [
    { id: 'ppl-push', name: 'Push', minutes: 60, exercises: [L('Bench Press', 4, 8), L('Overhead Press', 3, 8), L('Incline Bench Press', 3, 10), L('Triceps Pushdown', 3, 12), L('Dip', 3, 10)] },
    { id: 'ppl-pull', name: 'Pull', minutes: 60, exercises: [L('Deadlift', 3, 5), L('Pull-up', 4, 8), L('Barbell Row', 3, 10), L('Lat Pulldown', 3, 12), L('Dumbbell Curl', 3, 12)] },
    { id: 'ppl-legs', name: 'Legs', minutes: 60, exercises: [L('Back Squat', 4, 8), L('Romanian Deadlift', 3, 10), L('Leg Press', 3, 12), L('Hip Thrust', 3, 10), L('Calf Raise', 4, 15)] } ] },
  { id: 'ul', name: 'Upper and lower', level: 'Intermediate', days: '4 days a week', blurb: 'Upper body, lower body, twice each. Balanced and efficient.', workouts: [
    { id: 'ul-upper', name: 'Upper', minutes: 55, exercises: [L('Bench Press', 4, 6), L('Barbell Row', 4, 6), L('Overhead Press', 3, 8), L('Pull-up', 3, 8), L('Triceps Pushdown', 2, 12)] },
    { id: 'ul-lower', name: 'Lower', minutes: 55, exercises: [L('Back Squat', 4, 6), L('Romanian Deadlift', 3, 8), L('Leg Press', 3, 12), L('Lunge', 3, 10), L('Calf Raise', 3, 15)] } ] },
  { id: '5x5', name: 'Five by five strength', level: 'Beginner', days: '3 days a week', blurb: 'Five heavy sets of five. Add weight every session you can.', workouts: [
    { id: '5x5-a', name: 'Workout A', minutes: 45, exercises: [L('Back Squat', 5, 5), L('Bench Press', 5, 5), L('Barbell Row', 5, 5)] },
    { id: '5x5-b', name: 'Workout B', minutes: 45, exercises: [L('Back Squat', 5, 5), L('Overhead Press', 5, 5), L('Deadlift', 1, 5)] } ] },
  { id: 'home', name: 'No equipment', level: 'Any level', days: 'Anywhere', blurb: 'Bodyweight only. Enter 0 for the weight.', workouts: [
    { id: 'home-a', name: 'Bodyweight circuit', minutes: 30, exercises: [L('Push-up', 4, 12), L('Lunge', 3, 12), L('Plank', 3, 40), L('Glute Bridge', 3, 15), L('Pike Push-up', 3, 8)] } ] },
]
