import { useState } from 'react';
import { Student } from './components/tasks/Task1_Student';
import { EmployeeCard } from './components/tasks/Task2_EmployeeCard';
import { ProductCard } from './components/tasks/Task3_ProductCard';
import { MovieCard } from './components/tasks/Task4_MovieCard';
import { BookCard } from './components/tasks/Task5_BookCard';
import { CourseCard } from './components/tasks/Task6_CourseCard';
import { ProfileCard } from './components/tasks/Task7_ProfileCard';
import { StudentList } from './components/tasks/Task8_StudentList';
import { CompanyDetails } from './components/tasks/Task9_CompanyDetails';
import { Button } from './components/tasks/Task10_Button';
import { LoginStatus } from './components/tasks/Task11_LoginStatus';
import { StockStatus } from './components/tasks/Task12_StockStatus';
import { MarkStatus } from './components/tasks/Task13_MarkStatus';
import { AgeStatus } from './components/tasks/Task14_AgeStatus';
import { PremiumBadge } from './components/tasks/Task15_PremiumBadge';
import { DiscountLabel } from './components/tasks/Task16_DiscountLabel';
import { ActiveStatus } from './components/tasks/Task17_ActiveStatus';
import { RoleDashboard } from './components/tasks/Task18_RoleDashboard';
import { Greeting } from './components/tasks/Task19_Greeting';
import { ProfileImageFallback } from './components/tasks/Task20_ProfileImageFallback';
import { StudentCardTopper } from './components/tasks/Task21_StudentCardTopper';
import { EmployeeCardSenior } from './components/tasks/Task22_EmployeeCardSenior';
import { MovieCardBlockbuster } from './components/tasks/Task23_MovieCardBlockbuster';
import { ProductCardSale } from './components/tasks/Task24_ProductCardSale';
import { CourseCardClosed } from './components/tasks/Task25_CourseCardClosed';
import { RestaurantCardOpen } from './components/tasks/Task26_RestaurantCardOpen';
import { WeatherCardIcon } from './components/tasks/Task27_WeatherCardIcon';
import { ProfileCardVerified } from './components/tasks/Task28_ProfileCardVerified';
import { JobCardType } from './components/tasks/Task29_JobCardType';
import { StudentDashboard } from './components/tasks/Task30_StudentDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('props'); // props, conditional, combined, dashboard

  // --- Task States (Props) ---
  const [t1Name, setT1Name] = useState('Rahul Verma');
  const [t1Age, setT1Age] = useState(20);
  const [t1Course, setT1Course] = useState('Full Stack Web Development');

  const [t2Name, setT2Name] = useState('Jane Doe');
  const [t2Designation, setT2Designation] = useState('Senior UI Engineer');
  const [t2Salary, setT2Salary] = useState(125000);
  const [t2Dept, setT2Dept] = useState('Engineering');

  // Task 3: 5 products
  const productsData = [
    { name: 'iPhone 15 Pro', price: 999, category: 'Electronics' },
    { name: 'Ergonomic Desk Chair', price: 299, category: 'Furniture' },
    { name: 'Noise Cancelling Headphones', price: 349, category: 'Audio' },
    { name: 'Stainless Steel Water Bottle', price: 39, category: 'Lifestyle' },
    { name: 'Mechanical Keyboard', price: 129, category: 'Peripherals' }
  ];

  const [t4Title, setT4Title] = useState('Inception');
  const [t4Poster, setT4Poster] = useState('🌀');
  const [t4Rating, setT4Rating] = useState(8.8);
  const [t4Genre, setT4Genre] = useState('Sci-Fi / Thriller');

  const [t5Title, setT5Title] = useState('The Pragmatic Programmer');
  const [t5Author, setT5Author] = useState('Andy Hunt & Dave Thomas');
  const [t5Price, setT5Price] = useState(44.99);
  const [t5Category, setT5Category] = useState('Software Development');

  const [t6Name, setT6Name] = useState('Mastering React & Redux');
  const [t6Trainer, setT6Trainer] = useState('Dr. Angela Yu');
  const [t6Duration, setT6Duration] = useState('32 Hours');
  const [t6Fee, setT6Fee] = useState(99);

  const [t7Image, setT7Image] = useState('');
  const [t7Name, setT7Name] = useState('Amit Patel');
  const [t7Role, setT7Role] = useState('DevOps Lead');
  const [t7Location, setT7Location] = useState('Bangalore, India');

  // Task 8: Students Array
  const [t8Students, setT8Students] = useState([
    { name: 'Aarav', age: 19, course: 'Mathematics' },
    { name: 'Ishita', age: 21, course: 'Physics' },
    { name: 'Kabir', age: 20, course: 'Chemistry' }
  ]);
  const [newT8Name, setNewT8Name] = useState('');
  const [newT8Age, setNewT8Age] = useState('');
  const [newT8Course, setNewT8Course] = useState('');

  // Task 9: Company object
  const [t9Company, setT9Company] = useState({
    name: 'Google LLC',
    industry: 'Technology / Cloud',
    ceo: 'Sundar Pichai',
    employees: 182000,
    headquarters: 'Mountain View, CA'
  });

  // Task 10: Button Text & Alert
  const [t10Text, setT10Text] = useState('Click Me Now!');
  const [buttonClicks, setButtonClicks] = useState(0);

  // --- Task States (Conditional) ---
  const [t11LoggedIn, setT11LoggedIn] = useState(false);
  const [t12InStock, setT12InStock] = useState(true);
  const [t13Marks, setT13Marks] = useState(75);
  const [t14Age, setT14Age] = useState(17);
  const [t15Premium, setT15Premium] = useState(false);
  const [t16Discount, setT16Discount] = useState(20);
  const [t17Active, setT17Active] = useState(true);
  const [t18Role, setT18Role] = useState('User');
  const [t19Time, setT19Time] = useState('10:00');
  const [t20HasCustom, setT20HasCustom] = useState(false);

  // --- Task States (Combined) ---
  const [t21Marks, setT21Marks] = useState(95);
  const [t22Exp, setT22Exp] = useState(6);
  const [t23Rating, setT23Rating] = useState(8.9);
  const [t24OnSale, setT24OnSale] = useState(true);
  const [t25SeatsFull, setT25SeatsFull] = useState(false);
  
  // Task 26: Restaurant
  const [t26CurrentTime, setT26CurrentTime] = useState('12:00');
  
  // Task 27: Weather
  const [t27Condition, setT27Condition] = useState('Sunny');
  
  // Task 28: Profile Verified
  const [t28Verified, setT28Verified] = useState(true);
  
  // Task 29: Job Card
  const [t29Type, setT29Type] = useState('Remote');

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <aside className="app-sidebar">
        <div className="brand-section">
          <div className="brand-logo">
            <svg className="brand-logo-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="url(#paint0_linear)" strokeWidth="6" />
              <path d="M30 50L45 65L70 35" stroke="url(#paint0_linear)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="paint0_linear" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a855f7" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            ReactDev
          </div>
        </div>

        <nav className="nav-links">
          <button 
            className={`nav-item ${activeTab === 'props' ? 'active' : ''}`}
            onClick={() => setActiveTab('props')}
          >
            📦 Props Tasks (1-10)
          </button>
          <button 
            className={`nav-item ${activeTab === 'conditional' ? 'active' : ''}`}
            onClick={() => setActiveTab('conditional')}
          >
            ⚡ Conditional Rendering (11-20)
          </button>
          <button 
            className={`nav-item ${activeTab === 'combined' ? 'active' : ''}`}
            onClick={() => setActiveTab('combined')}
          >
            💠 Combined Features (21-29)
          </button>
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Student Dashboard (30)
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="developer-card">
            <div className="dev-avatar">AG</div>
            <div className="dev-info">
              <h4>Antigravity</h4>
              <p>Assistant Coach</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="app-content">
        {activeTab === 'props' && (
          <div>
            <div className="section-header">
              <h1>Props & Component Reusability</h1>
              <p>Understanding data flow down components using props, configuration objects, and lists.</p>
            </div>

            <div className="playground-grid">
              {/* Task 1: Student Component */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 01</span>
                  <h3 className="task-title">Student Props</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Controls</span>
                    <div className="form-group">
                      <label>Student Name</label>
                      <input type="text" value={t1Name} onChange={e => setT1Name(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Age</label>
                      <input type="number" value={t1Age} onChange={e => setT1Age(parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="form-group">
                      <label>Course</label>
                      <input type="text" value={t1Course} onChange={e => setT1Course(e.target.value)} />
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered</span>
                    <div className="output-window">
                      <Student name={t1Name} age={t1Age} course={t1Course} />
                    </div>
                    <pre className="code-inspector">{`<Student \n  name="${t1Name}" \n  age={${t1Age}} \n  course="${t1Course}" \n/>`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 2: EmployeeCard */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 02</span>
                  <h3 className="task-title">Employee Card Props</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Controls</span>
                    <div className="form-group">
                      <label>Employee Name</label>
                      <input type="text" value={t2Name} onChange={e => setT2Name(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Designation</label>
                      <input type="text" value={t2Designation} onChange={e => setT2Designation(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Salary ($)</label>
                      <input type="number" value={t2Salary} onChange={e => setT2Salary(parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="form-group">
                      <label>Department</label>
                      <input type="text" value={t2Dept} onChange={e => setT2Dept(e.target.value)} />
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered</span>
                    <div className="output-window">
                      <EmployeeCard name={t2Name} designation={t2Designation} salary={t2Salary} department={t2Dept} />
                    </div>
                    <pre className="code-inspector">{`<EmployeeCard \n  name="${t2Name}" \n  designation="${t2Designation}" \n  salary={${t2Salary}} \n  department="${t2Dept}" \n/>`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 3: 5 Different Products */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 03</span>
                  <h3 className="task-title">Product Catalog (5 Different Products)</h3>
                </div>
                <div>
                  <p className="card-detail" style={{ marginBottom: '16px' }}>
                    Rendered by feeding different sets of props to a single reusable <code>&lt;ProductCard /&gt;</code>.
                  </p>
                  <div className="students-grid">
                    {productsData.map((prod, idx) => (
                      <ProductCard 
                        key={idx}
                        name={prod.name} 
                        price={prod.price} 
                        category={prod.category} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Task 4: MovieCard */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 04</span>
                  <h3 className="task-title">Movie Card Props</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Controls</span>
                    <div className="form-group">
                      <label>Movie Title</label>
                      <input type="text" value={t4Title} onChange={e => setT4Title(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Genre</label>
                      <input type="text" value={t4Genre} onChange={e => setT4Genre(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Rating (1-10)</label>
                      <div className="range-container">
                        <input type="range" min="1" max="10" step="0.1" value={t4Rating} onChange={e => setT4Rating(parseFloat(e.target.value))} />
                        <span>{t4Rating}</span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Poster Emoji / Icon</label>
                      <input type="text" value={t4Poster} onChange={e => setT4Poster(e.target.value)} />
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered</span>
                    <div className="output-window">
                      <MovieCard title={t4Title} poster={t4Poster} rating={t4Rating} genre={t4Genre} />
                    </div>
                    <pre className="code-inspector">{`<MovieCard \n  title="${t4Title}" \n  poster="${t4Poster}" \n  rating={${t4Rating}} \n  genre="${t4Genre}" \n/>`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 5: BookCard */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 05</span>
                  <h3 className="task-title">Book Card Props</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Controls</span>
                    <div className="form-group">
                      <label>Book Title</label>
                      <input type="text" value={t5Title} onChange={e => setT5Title(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Author</label>
                      <input type="text" value={t5Author} onChange={e => setT5Author(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <input type="text" value={t5Category} onChange={e => setT5Category(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Price ($)</label>
                      <input type="number" min="0" step="0.01" value={t5Price} onChange={e => setT5Price(parseFloat(e.target.value) || 0)} />
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered</span>
                    <div className="output-window">
                      <BookCard title={t5Title} author={t5Author} price={t5Price} category={t5Category} />
                    </div>
                    <pre className="code-inspector">{`<BookCard \n  title="${t5Title}" \n  author="${t5Author}" \n  price={${t5Price}} \n  category="${t5Category}" \n/>`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 6: CourseCard */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 06</span>
                  <h3 className="task-title">Course Card Props</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Controls</span>
                    <div className="form-group">
                      <label>Course Name</label>
                      <input type="text" value={t6Name} onChange={e => setT6Name(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Trainer</label>
                      <input type="text" value={t6Trainer} onChange={e => setT6Trainer(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Duration</label>
                      <input type="text" value={t6Duration} onChange={e => setT6Duration(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Enrollment Fee ($)</label>
                      <input type="number" min="0" value={t6Fee} onChange={e => setT6Fee(parseInt(e.target.value) || 0)} />
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered</span>
                    <div className="output-window">
                      <CourseCard courseName={t6Name} trainer={t6Trainer} duration={t6Duration} fee={t6Fee} />
                    </div>
                    <pre className="code-inspector">{`<CourseCard \n  courseName="${t6Name}" \n  trainer="${t6Trainer}" \n  duration="${t6Duration}" \n  fee={${t6Fee}} \n/>`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 7: ProfileCard */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 07</span>
                  <h3 className="task-title">Profile Card Props</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Controls</span>
                    <div className="form-group">
                      <label>Profile Image URL (leave empty for default)</label>
                      <input type="text" value={t7Image} onChange={e => setT7Image(e.target.value)} placeholder="https://..." />
                    </div>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" value={t7Name} onChange={e => setT7Name(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Role</label>
                      <input type="text" value={t7Role} onChange={e => setT7Role(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input type="text" value={t7Location} onChange={e => setT7Location(e.target.value)} />
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered</span>
                    <div className="output-window">
                      <ProfileCard profileImage={t7Image} name={t7Name} role={t7Role} location={t7Location} />
                    </div>
                    <pre className="code-inspector">{`<ProfileCard \n  profileImage="${t7Image}" \n  name="${t7Name}" \n  role="${t7Role}" \n  location="${t7Location}" \n/>`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 8: Pass Student Array */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 08</span>
                  <h3 className="task-title">Passing Arrays as Props</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Add to Array</span>
                    <div className="form-group">
                      <label>Student Name</label>
                      <input type="text" value={newT8Name} onChange={e => setNewT8Name(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Age</label>
                      <input type="number" value={newT8Age} onChange={e => setNewT8Age(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Course</label>
                      <input type="text" value={newT8Course} onChange={e => setNewT8Course(e.target.value)} />
                    </div>
                    <button 
                      className="custom-btn btn-primary"
                      onClick={() => {
                        if (!newT8Name || !newT8Age || !newT8Course) return;
                        setT8Students([...t8Students, { name: newT8Name, age: parseInt(newT8Age), course: newT8Course }]);
                        setNewT8Name('');
                        setNewT8Age('');
                        setNewT8Course('');
                      }}
                    >
                      Add Student to Props Array
                    </button>
                    <button 
                      className="custom-btn btn-secondary"
                      onClick={() => setT8Students([])}
                    >
                      Clear Array
                    </button>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered &lt;StudentList /&gt;</span>
                    <div className="output-window" style={{ display: 'block', padding: '16px' }}>
                      <StudentList students={t8Students} />
                    </div>
                    <pre className="code-inspector">{`<StudentList \n  students={${JSON.stringify(t8Students, null, 2)}}\n/>`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 9: Pass Company Object */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 09</span>
                  <h3 className="task-title">Passing Objects as Props</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Edit Object Properties</span>
                    <div className="form-group">
                      <label>Company Name</label>
                      <input type="text" value={t9Company.name} onChange={e => setT9Company({ ...t9Company, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Industry</label>
                      <input type="text" value={t9Company.industry} onChange={e => setT9Company({ ...t9Company, industry: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>CEO</label>
                      <input type="text" value={t9Company.ceo} onChange={e => setT9Company({ ...t9Company, ceo: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Headquarters</label>
                      <input type="text" value={t9Company.headquarters} onChange={e => setT9Company({ ...t9Company, headquarters: e.target.value })} />
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered</span>
                    <div className="output-window">
                      <CompanyDetails company={t9Company} />
                    </div>
                    <pre className="code-inspector">{`<CompanyDetails \n  company={${JSON.stringify(t9Company, null, 2)}}\n/>`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 10: Button Props */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 10</span>
                  <h3 className="task-title">Reusable Button Prop</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Controls</span>
                    <div className="form-group">
                      <label>Button Label Text</label>
                      <input type="text" value={t10Text} onChange={e => setT10Text(e.target.value)} />
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered</span>
                    <div className="output-window">
                      <Button text={t10Text} onClick={() => setButtonClicks(buttonClicks + 1)} />
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                      Clicks count: <strong>{buttonClicks}</strong>
                    </p>
                    <pre className="code-inspector">{`<Button \n  text="${t10Text}" \n  onClick={() => alert("clicked!")} \n/>`}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'conditional' && (
          <div>
            <div className="section-header">
              <h1>Conditional Rendering Sandbox</h1>
              <p>Dynamic interfaces that update based on conditions, roles, and real-time state values.</p>
            </div>

            <div className="playground-grid">
              {/* Task 11: Login / Please Login */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 11</span>
                  <h3 className="task-title">User Authentication Message</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">State Toggle</span>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={t11LoggedIn} onChange={e => setT11LoggedIn(e.target.checked)} />
                      Toggle isLoggedIn Status
                    </label>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered</span>
                    <div className="output-window">
                      <LoginStatus isLoggedIn={t11LoggedIn} />
                    </div>
                    <pre className="code-inspector">{`<LoginStatus isLoggedIn={${t11LoggedIn}} />`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 12: Stock availability status */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 12</span>
                  <h3 className="task-title">Product Stock Status</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">State Toggle</span>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={t12InStock} onChange={e => setT12InStock(e.target.checked)} />
                      Mark product as In Stock
                    </label>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered</span>
                    <div className="output-window">
                      <StockStatus inStock={t12InStock} />
                    </div>
                    <pre className="code-inspector">{`<StockStatus inStock={${t12InStock}} />`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 13: Pass / Fail marks display */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 13</span>
                  <h3 className="task-title">Pass/Fail Threshold Rendering</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Controls</span>
                    <div className="form-group">
                      <label>Enter Student Marks (35 passing score)</label>
                      <div className="range-container">
                        <input type="range" min="0" max="100" value={t13Marks} onChange={e => setT13Marks(parseInt(e.target.value))} />
                        <span>{t13Marks}</span>
                      </div>
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered</span>
                    <div className="output-window">
                      <MarkStatus marks={t13Marks} />
                    </div>
                    <pre className="code-inspector">{`<MarkStatus marks={${t13Marks}} />`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 14: Adult / Minor */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 14</span>
                  <h3 className="task-title">Age Classification Display</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Controls</span>
                    <div className="form-group">
                      <label>Enter Age (18+ Adult classification)</label>
                      <div className="range-container">
                        <input type="range" min="1" max="100" value={t14Age} onChange={e => setT14Age(parseInt(e.target.value))} />
                        <span>{t14Age}</span>
                      </div>
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered</span>
                    <div className="output-window">
                      <AgeStatus age={t14Age} />
                    </div>
                    <pre className="code-inspector">{`<AgeStatus age={${t14Age}} />`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 15: Premium Badge tag */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 15</span>
                  <h3 className="task-title">Premium Badge Display</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">State Toggle</span>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={t15Premium} onChange={e => setT15Premium(e.target.checked)} />
                      User is Premium
                    </label>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered</span>
                    <div className="output-window">
                      <PremiumBadge isPremium={t15Premium} />
                      {!t15Premium && <span className="text-secondary">(Empty - Not Premium)</span>}
                    </div>
                    <pre className="code-inspector">{`<PremiumBadge isPremium={${t15Premium}} />`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 16: Discount label display */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 16</span>
                  <h3 className="task-title">Discount Label Badge</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Controls</span>
                    <div className="form-group">
                      <label>Discount Percentage (show only if &gt; 0%)</label>
                      <div className="range-container">
                        <input type="range" min="0" max="100" value={t16Discount} onChange={e => setT16Discount(parseInt(e.target.value))} />
                        <span>{t16Discount}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered</span>
                    <div className="output-window">
                      <DiscountLabel discount={t16Discount} />
                      {t16Discount === 0 && <span className="text-secondary">(Label hidden because discount is 0)</span>}
                    </div>
                    <pre className="code-inspector">{`<DiscountLabel discount={${t16Discount}} />`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 17: Online/Offline status */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 17</span>
                  <h3 className="task-title">Active State Status Indicator</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">State Toggle</span>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={t17Active} onChange={e => setT17Active(e.target.checked)} />
                      Mark Active State (isActive)
                    </label>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered</span>
                    <div className="output-window">
                      <ActiveStatus isActive={t17Active} />
                    </div>
                    <pre className="code-inspector">{`<ActiveStatus isActive={${t17Active}} />`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 18: Admin panel or user dashboard */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 18</span>
                  <h3 className="task-title">Role-Based Dashboard Router</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Controls</span>
                    <div className="form-group">
                      <label>Select User Role</label>
                      <select value={t18Role} onChange={e => setT18Role(e.target.value)}>
                        <option value="User">Regular User</option>
                        <option value="Admin">System Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered</span>
                    <div className="output-window" style={{ display: 'block', padding: '16px' }}>
                      <RoleDashboard role={t18Role} />
                    </div>
                    <pre className="code-inspector">{`<RoleDashboard role="${t18Role}" />`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 19: Good Morning / Good Afternoon / Good Evening */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 19</span>
                  <h3 className="task-title">Time-Based Greetings</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Controls</span>
                    <div className="form-group">
                      <label>Set Mock Time (Hour 00:00 - 23:59)</label>
                      <input type="time" value={t19Time} onChange={e => setT19Time(e.target.value)} />
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered</span>
                    <div className="output-window">
                      <Greeting customTime={t19Time} />
                    </div>
                    <pre className="code-inspector">{`<Greeting customTime="${t19Time}" />`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 20: Uploaded avatar custom image vs default */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 20</span>
                  <h3 className="task-title">Fallback Avatar Image</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">State Toggle</span>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={t20HasCustom} onChange={e => setT20HasCustom(e.target.checked)} />
                      Simulate Custom Profile Picture Uploaded
                    </label>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered Profile Card</span>
                    <div className="output-window">
                      <ProfileImageFallback 
                        profileImage={t20HasCustom ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80" : null} 
                        name="Raj Kumar" 
                      />
                    </div>
                    <pre className="code-inspector">
                      {t20HasCustom 
                        ? `<ProfileImageFallback \n  profileImage="https://images.unsplash.com/photo-..." \n/>` 
                        : `<ProfileImageFallback \n  profileImage={null} \n/>`
                      }
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'combined' && (
          <div>
            <div className="section-header">
              <h1>Combined Props + Conditional Rendering</h1>
              <p>Realistic composite layouts utilizing props data for both text rendering and logical visibility triggers.</p>
            </div>

            <div className="playground-grid">
              {/* Task 21: StudentCard displaying Topper if marks > 90 */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 21 & 30</span>
                  <h3 className="task-title">Student Card Topper Badge</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Controls</span>
                    <div className="form-group">
                      <label>Student Marks (Topper badge triggers at &gt; 90)</label>
                      <div className="range-container">
                        <input type="range" min="0" max="100" value={t21Marks} onChange={e => setT21Marks(parseInt(e.target.value))} />
                        <span>{t21Marks}/100</span>
                      </div>
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered Dashboard Card</span>
                    <div className="output-window">
                      <StudentCardTopper name="Vikas Gupta" marks={t21Marks} />
                    </div>
                    <pre className="code-inspector">{`<StudentCardTopper \n  name="Vikas Gupta" \n  marks={${t21Marks}} \n/>`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 22: EmployeeCard showing Senior Employee if experience > 5 */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 22</span>
                  <h3 className="task-title">Employee Senior Badge</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Controls</span>
                    <div className="form-group">
                      <label>Years of Experience (Senior if &gt; 5 years)</label>
                      <div className="range-container">
                        <input type="range" min="0" max="15" value={t22Exp} onChange={e => setT22Exp(parseInt(e.target.value))} />
                        <span>{t22Exp} yrs</span>
                      </div>
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered Employee</span>
                    <div className="output-window">
                      <EmployeeCardSenior name="Elena Rostova" designation="Lead Designer" salary={145000} department="Product Design" experience={t22Exp} />
                    </div>
                    <pre className="code-inspector">{`<EmployeeCardSenior \n  name="Elena Rostova" \n  experience={${t22Exp}} \n/>`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 23: MovieCard displaying Blockbuster if rating > 8.5 */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 23</span>
                  <h3 className="task-title">Movie Blockbuster Status</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Controls</span>
                    <div className="form-group">
                      <label>Movie Rating (Blockbuster if &gt; 8.5)</label>
                      <div className="range-container">
                        <input type="range" min="1" max="10" step="0.1" value={t23Rating} onChange={e => setT23Rating(parseFloat(e.target.value))} />
                        <span>{t23Rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered Movie</span>
                    <div className="output-window">
                      <MovieCardBlockbuster title="The Dark Knight" poster="🦇" rating={t23Rating} genre="Action / Drama" />
                    </div>
                    <pre className="code-inspector">{`<MovieCardBlockbuster \n  title="The Dark Knight" \n  rating={${t23Rating}} \n/>`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 24: ProductCard showing Sale Badge */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 24</span>
                  <h3 className="task-title">Product Card Sale Badge</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">State Toggle</span>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={t24OnSale} onChange={e => setT24OnSale(e.target.checked)} />
                      Mark Product on Sale
                    </label>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered Product</span>
                    <div className="output-window">
                      <ProductCardSale name="Airpods Pro" price={249} category="Audio" onSale={t24OnSale} />
                    </div>
                    <pre className="code-inspector">{`<ProductCardSale \n  name="Airpods Pro" \n  onSale={${t24OnSale}} \n/>`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 25: CourseCard displaying Enrollment Closed */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 25</span>
                  <h3 className="task-title">Course Closed Status</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">State Toggle</span>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={t25SeatsFull} onChange={e => setT25SeatsFull(e.target.checked)} />
                      Course Seats are Full
                    </label>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered Course</span>
                    <div className="output-window">
                      <CourseCardClosed courseName="NextJS App Router Mastery" trainer="Lee Robinson" duration="15 hrs" fee={149} seatsFull={t25SeatsFull} />
                    </div>
                    <pre className="code-inspector">{`<CourseCardClosed \n  courseName="NextJS App Router" \n  seatsFull={${t25SeatsFull}} \n/>`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 26: RestaurantCard displaying Open/Closed */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 26</span>
                  <h3 className="task-title">Restaurant Business Hours</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Controls</span>
                    <div className="form-group">
                      <label>Set Mock Time (Business Hours: 11:00 - 23:00)</label>
                      <input type="time" value={t26CurrentTime} onChange={e => setT26CurrentTime(e.target.value)} />
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered Restaurant</span>
                    <div className="output-window">
                      <RestaurantCardOpen name="The Spicy Curry Bistro" cuisine="North Indian / Mughal" openTime="11:00" closeTime="23:00" currentTime={t26CurrentTime} />
                    </div>
                    <pre className="code-inspector">{`<RestaurantCardOpen \n  openTime="11:00" \n  closeTime="23:00" \n  currentTime="${t26CurrentTime}" \n/>`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 27: WeatherCard weather condition icons */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 27</span>
                  <h3 className="task-title">Weather Conditions & Icons</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Controls</span>
                    <div className="form-group">
                      <label>Select Weather Condition</label>
                      <select value={t27Condition} onChange={e => setT27Condition(e.target.value)}>
                        <option value="Sunny">Sunny ☀️</option>
                        <option value="Rainy">Rainy 🌧️</option>
                        <option value="Cloudy">Cloudy ☁️</option>
                      </select>
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered Weather</span>
                    <div className="output-window">
                      <WeatherCardIcon city="Mumbai" temperature={31} condition={t27Condition} />
                    </div>
                    <pre className="code-inspector">{`<WeatherCardIcon \n  city="Mumbai" \n  condition="${t27Condition}" \n/>`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 28: ProfileCard verified status badge */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 28</span>
                  <h3 className="task-title">Profile Verification Badge</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">State Toggle</span>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={t28Verified} onChange={e => setT28Verified(e.target.checked)} />
                      User is Verified
                    </label>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered Profile</span>
                    <div className="output-window">
                      <ProfileCardVerified name="Neha Sharma" role="Staff Scientist" location="San Francisco, CA" isVerified={t28Verified} />
                    </div>
                    <pre className="code-inspector">{`<ProfileCardVerified \n  name="Neha Sharma" \n  isVerified={${t28Verified}} \n/>`}</pre>
                  </div>
                </div>
              </div>

              {/* Task 29: JobCard remote / on-site */}
              <div className="glass-card task-widget">
                <div className="task-widget-header">
                  <span className="task-badge">Task 29</span>
                  <h3 className="task-title">Job Type Tagging</h3>
                </div>
                <div className="task-playground-container">
                  <div className="playground-controls">
                    <span className="control-title">Controls</span>
                    <div className="form-group">
                      <label>Job Type</label>
                      <select value={t29Type} onChange={e => setT29Type(e.target.value)}>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                      </select>
                    </div>
                  </div>
                  <div className="playground-output">
                    <span className="output-header">Live Rendered Job Card</span>
                    <div className="output-window">
                      <JobCardType title="Staff Software Architect" company="Stripe Inc." type={t29Type} salary="$195k - $240k" />
                    </div>
                    <pre className="code-inspector">{`<JobCardType \n  title="Staff Software Architect" \n  type="${t29Type}" \n/>`}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="glass-card">
            <StudentDashboard />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
