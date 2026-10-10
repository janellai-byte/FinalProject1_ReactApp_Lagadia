import { useMemo, useState } from 'react'
import { X, Minus, Plus, ClipboardList, CalendarDays, Users, ArrowRight, Check } from 'lucide-react'

type Item = { id: string; name: string; detail: string; price: number; image: string }
type Selection = Record<string, number>

const rooms: Item[] = [
  { id: 'conference', name: 'Conference Room', detail: 'Capacity: 15', price: 3500, image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80' },
  { id: 'auditorium', name: 'Auditorium Hall', detail: 'Capacity: 200', price: 5500, image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=700&q=80' },
  { id: 'presentation', name: 'Presentation Room', detail: 'Capacity: 50', price: 700, image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=700&q=80' },
  { id: 'large', name: 'Large Meeting Room', detail: 'Capacity: 10', price: 900, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=700&q=80' },
  { id: 'small', name: 'Small Meeting Room', detail: 'Capacity: 5', price: 1100, image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80' },
]
const addons: Item[] = [
  { id: 'projectors', name: 'Projectors', detail: 'Audio / visual', price: 200, image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=700&q=80' },
  { id: 'speakers', name: 'Speakers', detail: 'Sound equipment', price: 35, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80' },
  { id: 'microphones', name: 'Microphones', detail: 'Audio equipment', price: 45, image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=700&q=80' },
  { id: 'whiteboards', name: 'Whiteboards', detail: 'Meeting supplies', price: 80, image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=700&q=80' },
  { id: 'signage', name: 'Signage', detail: 'Event signs', price: 80, image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80' },
]
const meals = [
  { id: 'breakfast', name: 'Breakfast', price: 50 },
  { id: 'lunch', name: 'Lunch', price: 60 },
  { id: 'highTea', name: 'High Tea', price: 25 },
  { id: 'dinner', name: 'Dinner', price: 70 },
]
const money = (amount: number) => '$' + amount.toLocaleString('en-US', { maximumFractionDigits: 2 })

function App() {
  const [started, setStarted] = useState(false)
  const [roomCounts, setRoomCounts] = useState<Selection>({})
  const [addonCounts, setAddonCounts] = useState<Selection>({})
  const [selectedMeals, setSelectedMeals] = useState<string[]>([])
  const [people, setPeople] = useState(30)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('venue')

  const roomTotal = useMemo(() => rooms.reduce((sum, item) => sum + item.price * (roomCounts[item.id] || 0), 0), [roomCounts])
  const addonTotal = useMemo(() => addons.reduce((sum, item) => sum + item.price * (addonCounts[item.id] || 0), 0), [addonCounts])
  const mealTotal = useMemo(() => meals.reduce((sum, item) => sum + (selectedMeals.includes(item.id) ? item.price * people : 0), 0), [selectedMeals, people])
  const grandTotal = roomTotal + addonTotal + mealTotal

  const updateCount = (setCounts: React.Dispatch<React.SetStateAction<Selection>>, id: string, delta: number) => {
    setCounts(previous => ({ ...previous, [id]: Math.max(0, (previous[id] || 0) + delta) }))
  }
  const jumpTo = (section: string) => {
    setActiveSection(section)
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!started) {
    return (
      <main className="landing">
        <div className="landing-shade" />
        <nav className="landing-nav"><span className="brand-mark"><CalendarDays size={20} /> CEP</span><span>Conference Expense Planner</span></nav>
        <section className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">PLAN SMARTER. MEET BETTER.</p>
            <h1>Conference Expense Planner</h1>
            <p className="hero-subtitle">Plan your next major event with confidence.</p>
            <p className="hero-description">Bring every part of your event together in one place. Choose your venue, arrange equipment and meals, and get a clear cost breakdown before your big day.</p>
            <button className="primary-button" onClick={() => setStarted(true)}>Get Started <ArrowRight size={18} /></button>
          </div>
          <div className="hero-stat"><Users size={22}/><div><strong>One simple planner</strong><span>Rooms, equipment & catering</span></div></div>
        </section>
        <footer className="landing-footer">MAKE YOUR NEXT EVENT A SUCCESS <span>•</span> PLAN WITH CLARITY</footer>
      </main>
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => { setStarted(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><span className="brand-icon"><CalendarDays size={19}/></span><span>Conference <b>Expense Planner</b></span></button>
        <nav className="main-nav" aria-label="Main navigation">
          <button className={activeSection === 'venue' ? 'nav-link active' : 'nav-link'} onClick={() => jumpTo('venue')}>Venue</button>
          <button className={activeSection === 'addons' ? 'nav-link active' : 'nav-link'} onClick={() => jumpTo('addons')}>Add-ons</button>
          <button className={activeSection === 'meals' ? 'nav-link active' : 'nav-link'} onClick={() => jumpTo('meals')}>Meals</button>
        </nav>
        <button className="details-button" onClick={() => setDetailsOpen(true)}><ClipboardList size={17}/> Show Details</button>
      </header>

      <main className="planner">
        <section className="welcome-row">
          <div><p className="eyebrow dark">YOUR EVENT, AT A GLANCE</p><h1>Build your conference plan</h1><p>Choose what you need and your estimated total updates automatically.</p></div>
          <div className="total-pill"><span>Estimated event total</span><strong>{money(grandTotal)}</strong></div>
        </section>

        <section className="planner-section" id="venue">
          <div className="section-heading"><div><span className="section-number">01</span><h2>Venue room selection</h2></div><p>Select the rooms for your event</p></div>
          <div className="item-grid room-grid">
            {rooms.map(item => <article className="item-card" key={item.id}>
              <img src={item.image} alt={item.name} onError={e => { e.currentTarget.style.visibility = 'hidden' }} />
              <div className="item-card-body"><h3>{item.name}</h3><p className="item-detail">{item.detail}</p><strong className="item-price">{money(item.price)} <small>/ room</small></strong>
                <div className="quantity-control"><button aria-label={`Remove ${item.name}`} onClick={() => updateCount(setRoomCounts, item.id, -1)} disabled={!roomCounts[item.id]}><Minus size={14}/></button><span>{roomCounts[item.id] || 0}</span><button aria-label={`Add ${item.name}`} onClick={() => updateCount(setRoomCounts, item.id, 1)}><Plus size={14}/></button></div>
                <div className="line-total">Subtotal <b>{money(item.price * (roomCounts[item.id] || 0))}</b></div>
              </div>
            </article>)}
          </div>
          <TotalStrip label="Venue subtotal" total={roomTotal}/>
        </section>

        <section className="planner-section" id="addons">
          <div className="section-heading"><div><span className="section-number">02</span><h2>Add-ons selection</h2></div><p>Equipment and extras for your event</p></div>
          <div className="item-grid addon-grid">
            {addons.map(item => <article className="item-card addon-card" key={item.id}>
              <img src={item.image} alt={item.name} onError={e => { e.currentTarget.style.visibility = 'hidden' }} />
              <div className="item-card-body"><h3>{item.name}</h3><p className="item-detail">{item.detail}</p><strong className="item-price">{money(item.price)} <small>/ item</small></strong>
                <div className="quantity-control"><button aria-label={`Remove ${item.name}`} onClick={() => updateCount(setAddonCounts, item.id, -1)} disabled={!addonCounts[item.id]}><Minus size={14}/></button><span>{addonCounts[item.id] || 0}</span><button aria-label={`Add ${item.name}`} onClick={() => updateCount(setAddonCounts, item.id, 1)}><Plus size={14}/></button></div>
                <div className="line-total">Subtotal <b>{money(item.price * (addonCounts[item.id] || 0))}</b></div>
              </div>
            </article>)}
          </div>
          <TotalStrip label="Add-ons subtotal" total={addonTotal}/>
        </section>

        <section className="planner-section meals-section" id="meals">
          <div className="section-heading"><div><span className="section-number">03</span><h2>Meals selection</h2></div><p>Choose catering for your guests</p></div>
          <div className="meals-panel">
            <label className="people-input"><span>Number of people</span><input type="number" min="1" max="10000" value={people} onChange={e => setPeople(Math.max(1, Number(e.target.value) || 1))}/></label>
            <div className="meal-grid">
              {meals.map(meal => <label className={`meal-option ${selectedMeals.includes(meal.id) ? 'chosen' : ''}`} key={meal.id}>
                <input type="checkbox" checked={selectedMeals.includes(meal.id)} onChange={e => setSelectedMeals(prev => e.target.checked ? [...prev, meal.id] : prev.filter(id => id !== meal.id))}/>
                <span className="custom-check">{selectedMeals.includes(meal.id) && <Check size={14}/>}</span>
                <span className="meal-copy"><b>{meal.name}</b><small>{money(meal.price)} per person</small></span>
                <strong>{money(meal.price * people)}</strong>
              </label>)}
            </div>
            <TotalStrip label={`Meals subtotal · ${people} people`} total={mealTotal}/>
          </div>
        </section>

        <section className="grand-total-card"><div><span>YOUR ESTIMATED EVENT COST</span><h2>{money(grandTotal)}</h2><p>Includes selected rooms, equipment and meals.</p></div><button className="primary-button" onClick={() => setDetailsOpen(true)}>Review breakdown <ArrowRight size={18}/></button></section>
        <footer className="page-footer">Conference Expense Planner <span>•</span> Budget confidently, host brilliantly.</footer>
      </main>

      {detailsOpen && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setDetailsOpen(false) }}>
        <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <header className="modal-header"><div><p className="eyebrow dark">YOUR COST SUMMARY</p><h2 id="modal-title">Event expense details</h2><p>Review the items selected for your conference.</p></div><button className="close-button" aria-label="Close details" onClick={() => setDetailsOpen(false)}><X size={21}/></button></header>
          <div className="table-wrap"><table><thead><tr><th>Name</th><th>Unit cost</th><th>Quantity</th><th>Total cost</th></tr></thead><tbody>
            {rooms.filter(item => (roomCounts[item.id] || 0) > 0).map(item => <tr key={item.id}><td>{item.name}</td><td>{money(item.price)}</td><td>{roomCounts[item.id]}</td><td>{money(item.price * roomCounts[item.id])}</td></tr>)}
            {addons.filter(item => (addonCounts[item.id] || 0) > 0).map(item => <tr key={item.id}><td>{item.name}</td><td>{money(item.price)}</td><td>{addonCounts[item.id]}</td><td>{money(item.price * addonCounts[item.id])}</td></tr>)}
            {meals.filter(item => selectedMeals.includes(item.id)).map(item => <tr key={item.id}><td>{item.name} ({people} people)</td><td>{money(item.price)} / person</td><td>{people} people</td><td>{money(item.price * people)}</td></tr>)}
            {grandTotal === 0 && <tr><td colSpan={4} className="empty-state">No items selected yet. Close this window and add rooms, equipment, or meals.</td></tr>}
          </tbody><tfoot><tr><td colSpan={3}>Venue subtotal</td><td>{money(roomTotal)}</td></tr><tr><td colSpan={3}>Add-ons subtotal</td><td>{money(addonTotal)}</td></tr><tr><td colSpan={3}>Meals subtotal</td><td>{money(mealTotal)}</td></tr><tr className="grand-row"><td colSpan={3}>TOTAL COST FOR THE EVENT</td><td>{money(grandTotal)}</td></tr></tfoot></table></div>
          <div className="modal-actions"><span>Prices shown in USD ($)</span><button className="primary-button" onClick={() => setDetailsOpen(false)}>Done</button></div>
        </section>
      </div>}
    </div>
  )
}

function TotalStrip({ label, total }: { label: string; total: number }) {
  return <div className="total-strip"><span>{label}</span><strong>{money(total)}</strong></div>
}

export default App
