'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type ActivityLevel = 'low' | 'moderate' | 'high'
type Region = 'Tamil Nadu' | 'Maharashtra' | 'Punjab' | 'Kerala'
type Goal = 'maintain' | 'lose' | 'gain'
type Condition = 'None' | 'Diabetes' | 'Hypertension' | 'PCOS' | 'High cholesterol'
type Meal = { name: string; detail: string; calories: number; protein: number; ingredients: string[] }

const activityFactors: Record<ActivityLevel, number> = { low: 1.2, moderate: 1.45, high: 1.7 }

const regionalMeals: Record<Region, Meal[]> = {
  'Tamil Nadu': [
    { name: 'Ragi dosa with keerai sambar', detail: 'High-fiber local breakfast', calories: 390, protein: 16, ingredients: ['ragi', 'spinach', 'lentils'] },
    { name: 'Red rice, vegetable poriyal and dal', detail: 'Balanced lunch plate', calories: 560, protein: 22, ingredients: ['rice', 'vegetables', 'lentils'] },
    { name: 'Idli with tomato chutney', detail: 'Light dinner option', calories: 320, protein: 11, ingredients: ['rice', 'tomato'] },
  ],
  Maharashtra: [
    { name: 'Vegetable poha with curd', detail: 'Budget-friendly breakfast', calories: 360, protein: 14, ingredients: ['poha', 'vegetables', 'curd'] },
    { name: 'Jowar bhakri with usal', detail: 'Whole-grain lunch plate', calories: 540, protein: 24, ingredients: ['jowar', 'lentils', 'onion'] },
    { name: 'Matki salad and egg bhurji', detail: 'Protein-forward dinner', calories: 410, protein: 29, ingredients: ['matki', 'eggs', 'tomato'] },
  ],
  Punjab: [
    { name: 'Besan chilla with curd', detail: 'Protein-rich breakfast', calories: 400, protein: 23, ingredients: ['besan', 'curd', 'onion'] },
    { name: 'Chapati, rajma and salad', detail: 'Fiber-rich lunch plate', calories: 590, protein: 26, ingredients: ['wheat', 'rajma', 'vegetables'] },
    { name: 'Paneer tikka with vegetables', detail: 'Low-grain dinner', calories: 460, protein: 31, ingredients: ['paneer', 'vegetables'] },
  ],
  Kerala: [
    { name: 'Puttu with kadala curry', detail: 'Traditional protein pairing', calories: 430, protein: 18, ingredients: ['rice', 'chickpeas', 'coconut'] },
    { name: 'Red rice, aviyal and fish curry', detail: 'Seasonal coastal lunch', calories: 570, protein: 32, ingredients: ['rice', 'fish', 'vegetables'] },
    { name: 'Appam with vegetable stew', detail: 'Comforting light dinner', calories: 380, protein: 12, ingredients: ['rice', 'vegetables', 'coconut'] },
  ],
}

const substitutions: Record<string, string> = {
  Carrot: 'pumpkin, sweet potato, or beetroot', Spinach: 'keerai, moringa leaves, or cabbage',
  Chicken: 'eggs, fish, paneer, or lentils', Rice: 'red rice, millet, or jowar bhakri',
}

export default function DashboardPage() {
  const [weight, setWeight] = useState(68)
  const [height, setHeight] = useState(165)
  const [age, setAge] = useState(29)
  const [gender, setGender] = useState<'female' | 'male'>('female')
  const [activity, setActivity] = useState<ActivityLevel>('moderate')
  const [goal, setGoal] = useState<Goal>('maintain')
  const [condition, setCondition] = useState<Condition>('None')
  const [allergy, setAllergy] = useState('')
  const [region, setRegion] = useState<Region>('Tamil Nadu')
  const [budget, setBudget] = useState(450)
  const [pantry, setPantry] = useState('rice, lentils, vegetables, eggs')
  const [water, setWater] = useState(4)
  const [missingFood, setMissingFood] = useState('Carrot')
  const [progress, setProgress] = useState<number[]>([])
  const [progressWeight, setProgressWeight] = useState(weight)
  const [mealOverrides, setMealOverrides] = useState<Partial<Record<'Breakfast' | 'Lunch' | 'Dinner', Meal>>>({})
  const [assistantInput, setAssistantInput] = useState('')
  const [assistantMessages, setAssistantMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: 'I am your local NutriAI assistant. Try “replace today’s dinner”, “increase protein”, “reduce calories”, or “I am traveling tomorrow”.' },
  ])

  useEffect(() => {
    const saved = window.localStorage.getItem('nutria-progress')
    if (saved) setProgress(JSON.parse(saved))
  }, [])

  const logProgress = () => {
    const next = [...progress, progressWeight].slice(-7)
    setProgress(next)
    window.localStorage.setItem('nutria-progress', JSON.stringify(next))
  }

  const nutrition = useMemo(() => {
    const bmi = weight / ((height / 100) ** 2)
    const bmr = 10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161)
    const goalAdjustment = goal === 'lose' ? -300 : goal === 'gain' ? 250 : 0
    const calories = Math.max(1200, bmr * activityFactors[activity] + goalAdjustment)
    const proteinMultiplier = condition === 'PCOS' ? 1.8 : 1.6
    return { bmi: bmi.toFixed(1), bmr: Math.round(bmr), calories: Math.round(calories), protein: Math.round(weight * proteinMultiplier), carbs: Math.round((calories * 0.45) / 4), fat: Math.round((calories * 0.3) / 9), fiber: Math.round((calories / 1000) * 14), waterTarget: Math.max(8, Math.round(weight * 0.033)) }
  }, [activity, age, condition, gender, goal, height, weight])
  const meals = regionalMeals[region]
  const pantryItems = pantry.toLowerCase().split(',').map((item) => item.trim()).filter(Boolean)
  const availableMeals = meals.filter((meal) => meal.ingredients.some((ingredient) => pantryItems.some((item) => item.includes(ingredient) || ingredient.includes(item))))
  const budgetMessage = budget < 350 ? 'Try lentils, eggs, seasonal vegetables, and millet to stay within budget.' : 'Your budget supports a varied local-cuisine plan.'
  const conditionNote = condition === 'None' ? 'Balanced meals across your selected cuisine.' : condition === 'Diabetes' ? 'Favor lower-GI grains, pulses, and unsweetened foods.' : condition === 'Hypertension' ? 'Keep sodium low and favor fresh, minimally processed foods.' : condition === 'PCOS' ? 'Higher protein and fiber can support steadier meals.' : 'Favor fiber-rich foods and limit saturated fat.'

  const askAssistant = () => {
    const question = assistantInput.trim()
    if (!question) return
    const normalized = question.toLowerCase()
    let response = 'I can update one part of the plan at a time. Try “replace dinner”, “increase protein”, “reduce calories”, or “traveling tomorrow”.'
    const nextOverrides = { ...mealOverrides }
    if (normalized.includes('replace') && normalized.includes('dinner')) {
      nextOverrides.Dinner = { name: 'Lentil and vegetable bowl', detail: 'One-meal replacement with pantry staples', calories: 360, protein: Math.max(22, nutrition.protein - 25), ingredients: ['lentils', 'vegetables'] }
      response = 'I changed dinner only to a lentil and vegetable bowl. It stays high in fiber and uses common pantry ingredients.'
    } else if (normalized.includes('increase') && normalized.includes('protein')) {
      nextOverrides.Breakfast = { ...(nextOverrides.Breakfast || meals[0]), name: `${(nextOverrides.Breakfast || meals[0]).name} with extra curd`, protein: (nextOverrides.Breakfast || meals[0]).protein + 8 }
      response = 'I increased breakfast protein by adding curd. The rest of today’s plan is unchanged.'
    } else if (normalized.includes('reduce') && normalized.includes('calorie')) {
      nextOverrides.Dinner = { ...(nextOverrides.Dinner || meals[2]), name: 'Vegetable and lentil soup', calories: 280, protein: 18 }
      response = 'I reduced dinner calories only by switching to vegetable and lentil soup. Your daily target remains available in the nutrition panel.'
    } else if (normalized.includes('travel')) {
      nextOverrides.Lunch = { ...(nextOverrides.Lunch || meals[1]), name: 'Travel-friendly roasted chana, fruit and curd', detail: 'Portable meal with no reheating required', calories: 420, protein: 20, ingredients: ['chana', 'fruit', 'curd'] }
      response = 'I adapted lunch for travel with portable foods. Breakfast and dinner remain unchanged.'
    }
    setMealOverrides(nextOverrides)
    setAssistantMessages((messages) => [...messages, { role: 'user', text: question }, { role: 'assistant', text: response }])
    setAssistantInput('')
  }
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-slate-800 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">NutriAI / public preview</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">Your food, your context.</h1>
            <p className="mt-3 max-w-2xl text-slate-400">Build a local, budget-aware nutrition plan without creating an account. Your inputs stay in this browser session.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700">Home</Link>
            <Link href="/login" className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900">Sign in</Link>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-lg font-semibold">Your context</h2>
            <p className="mt-1 text-sm text-slate-500">Change any value to update the plan.</p>
            <div className="mt-5 space-y-4">
              <label className="block text-sm text-slate-300">Age<input type="number" min="13" value={age} onChange={(event) => setAge(Number(event.target.value))} className="input" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm text-slate-300">Weight (kg)<input type="number" min="30" value={weight} onChange={(event) => setWeight(Number(event.target.value))} className="input" /></label>
                <label className="block text-sm text-slate-300">Height (cm)<input type="number" min="120" value={height} onChange={(event) => setHeight(Number(event.target.value))} className="input" /></label>
              </div>
              <label className="block text-sm text-slate-300">Gender<select value={gender} onChange={(event) => setGender(event.target.value as 'female' | 'male')} className="input"><option value="female">Female</option><option value="male">Male</option></select></label>
              <label className="block text-sm text-slate-300">Activity level<select value={activity} onChange={(event) => setActivity(event.target.value as ActivityLevel)} className="input"><option value="low">Low movement</option><option value="moderate">Moderately active</option><option value="high">Highly active</option></select></label>
              <label className="block text-sm text-slate-300">Primary goal<select value={goal} onChange={(event) => setGoal(event.target.value as Goal)} className="input"><option value="maintain">Maintain weight</option><option value="lose">Lose weight</option><option value="gain">Gain weight</option></select></label>
              <label className="block text-sm text-slate-300">Regional cuisine<select value={region} onChange={(event) => setRegion(event.target.value as Region)} className="input">{Object.keys(regionalMeals).map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="block text-sm text-slate-300">Health focus<select value={condition} onChange={(event) => setCondition(event.target.value as Condition)} className="input"><option>None</option><option>Diabetes</option><option>Hypertension</option><option>PCOS</option><option>High cholesterol</option></select></label>
              <label className="block text-sm text-slate-300">Food allergies<input value={allergy} onChange={(event) => setAllergy(event.target.value)} placeholder="e.g. peanuts" className="input" /></label>
              <label className="block text-sm text-slate-300">Daily budget (INR)<input type="number" min="100" value={budget} onChange={(event) => setBudget(Number(event.target.value))} className="input" /></label>
              <label className="block text-sm text-slate-300">Pantry ingredients<input value={pantry} onChange={(event) => setPantry(event.target.value)} className="input" /><span className="mt-1 block text-xs text-slate-600">Comma-separated, such as rice, eggs, tomato</span></label>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Metric label="BMI" value={nutrition.bmi} note="Calculated from your profile" />
              <Metric label="Daily calories" value={`${nutrition.calories}`} note="Estimated TDEE" />
              <Metric label="Protein target" value={`${nutrition.protein}g`} note="1.6g per kg body weight" />
              <Metric label="Water target" value={`${nutrition.waterTarget} glasses`} note="Approximate daily target" />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-start justify-between gap-4"><div><p className="text-sm uppercase tracking-widest text-emerald-400">Today&apos;s adaptive plan</p><h2 className="mt-1 text-2xl font-semibold">{region} meals</h2></div><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">{budgetMessage}</span></div>
                <div className="mt-5 divide-y divide-slate-800">{(availableMeals.length ? availableMeals : meals).map((meal, index) => { const slot = (['Breakfast', 'Lunch', 'Dinner'] as const)[index]; const displayedMeal = mealOverrides[slot] || meal; return <article key={`${slot}-${displayedMeal.name}`} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{slot}</p><h3 className="mt-1 font-medium text-slate-100">{displayedMeal.name}</h3><p className="mt-1 text-sm text-slate-400">{displayedMeal.detail}. {displayedMeal.protein}g protein.</p></div><div className="text-left text-sm text-slate-300 sm:text-right"><strong>{displayedMeal.calories} kcal</strong><p className="text-slate-500">{mealOverrides[slot] ? 'Updated by NutriAI' : 'Pantry-compatible'}</p></div></article> })}</div>
                <p className="mt-4 border-l-2 border-emerald-400 pl-3 text-sm text-slate-400">{conditionNote} {allergy ? `Avoiding ${allergy}.` : ''} Local staples improve availability and affordability while pairing grains with pulses or dairy helps make each meal more balanced.</p>
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><p className="text-sm uppercase tracking-widest text-amber-300">Smart replacement</p><h2 className="mt-1 text-2xl font-semibold">Missing an ingredient?</h2><p className="mt-2 text-sm text-slate-400">Replace one item without regenerating the whole day.</p><select value={missingFood} onChange={(event) => setMissingFood(event.target.value)} className="input mt-5"><option>Carrot</option><option>Spinach</option><option>Chicken</option><option>Rice</option></select><div className="mt-4 rounded-xl bg-slate-950 p-4"><p className="text-sm text-slate-500">Replace {missingFood} with</p><p className="mt-1 text-lg font-medium text-amber-200">{substitutions[missingFood]}</p><p className="mt-3 text-sm text-slate-400">These alternatives keep the meal in the same nutrition family and fit the selected cuisine.</p></div></section>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex justify-between"><div><p className="text-sm uppercase tracking-widest text-sky-300">Nutrition targets</p><h2 className="mt-1 text-2xl font-semibold">Daily balance</h2></div><span className="text-sm text-slate-500">BMR {nutrition.bmr}</span></div><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><Target label="Carbohydrates" value={`${nutrition.carbs}g`} /><Target label="Fat" value={`${nutrition.fat}g`} /><Target label="Fiber" value={`${nutrition.fiber}g`} /><Target label="Sodium" value="Under 2,300mg" /></div></section>
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><p className="text-sm uppercase tracking-widest text-sky-300">Hydration</p><h2 className="mt-1 text-2xl font-semibold">Water tracker</h2><div className="mt-5 flex items-center justify-between"><span className="text-4xl font-semibold text-sky-200">{water}</span><span className="text-sm text-slate-500">of {nutrition.waterTarget} glasses</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-sky-400" style={{ width: `${Math.min(100, (water / nutrition.waterTarget) * 100)}%` }} /></div><button type="button" onClick={() => setWater((value) => Math.min(nutrition.waterTarget, value + 1))} className="mt-5 rounded-xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-300">Log one glass</button></section>
            </div>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm uppercase tracking-widest text-rose-300">Progress tracker</p><h2 className="mt-1 text-2xl font-semibold">Keep a simple weekly record</h2><p className="mt-2 text-sm text-slate-400">Saved locally in this browser. No account required.</p></div><div className="flex gap-2"><input aria-label="Current weight" type="number" value={progressWeight} onChange={(event) => setProgressWeight(Number(event.target.value))} className="input mt-0 max-w-28" /><button type="button" onClick={logProgress} className="rounded-xl bg-rose-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-rose-200">Log weight</button></div></div><div className="mt-5 flex min-h-24 items-end gap-2">{(progress.length ? progress : [weight]).map((entry, index) => <div key={`${entry}-${index}`} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-lg bg-rose-300/70" style={{ height: `${Math.max(20, Math.min(90, entry))}%` }} /><span className="text-xs text-slate-500">{entry}kg</span></div>)}</div></section>

            <section className="rounded-2xl border border-emerald-900/60 bg-slate-900 p-5"><div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-widest text-emerald-400">NutriAI assistant</p><h2 className="mt-1 text-2xl font-semibold">Change one meal, naturally</h2></div><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">Free local mode</span></div><div className="mt-4 max-h-56 space-y-3 overflow-y-auto rounded-xl bg-slate-950 p-4">{assistantMessages.map((message, index) => <div key={`${message.role}-${index}`} className={message.role === 'user' ? 'ml-8 rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-100' : 'mr-8 rounded-xl bg-slate-800 p-3 text-sm text-slate-300'}>{message.text}</div>)}</div><form className="mt-4 flex gap-2" onSubmit={(event) => { event.preventDefault(); askAssistant() }}><input value={assistantInput} onChange={(event) => setAssistantInput(event.target.value)} placeholder="e.g. Replace today's dinner" className="input mt-0" /><button type="submit" className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300">Ask</button></form><p className="mt-3 text-xs text-slate-600">This free mode uses transparent nutrition rules in your browser. Connect Ollama later for open-ended conversation.</p></section>
          </section>
        </div>
        <p className="mt-8 text-xs text-slate-600">This preview provides general nutrition estimates, not medical advice. Diabetes, kidney disease, pregnancy, and other conditions should be reviewed with a qualified clinician.</p>
      </div>
    </main>
  )
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold text-emerald-300">{value}</p><p className="mt-1 text-xs text-slate-600">{note}</p></div>
}

function Target({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-950 p-3"><p className="text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-100">{value}</p></div>
}
