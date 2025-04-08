// import React, { useState } from 'react';
// // import './AuthForm.css'; // Assumes you're using external CSS
// import AuthForm from './components/AuthForm';

// function AuthForm() {
//   const [activeTab, setActiveTab] = useState('login');

//   return (
//     <div className="auth-container">
//       <div className="auth-box">
//         <div className="left-panel">
//           <h1>Welcome Back</h1>
//           <p>Sign in to continue your journey through Wikipedia policies</p>

//           <div className="tab-switcher">
//             <button
//               className={activeTab === 'login' ? 'active' : ''}
//               onClick={() => setActiveTab('login')}
//             >
//               Login
//             </button>
//             <button
//               className={activeTab === 'signup' ? 'active' : ''}
//               onClick={() => setActiveTab('signup')}
//             >
//               Sign Up
//             </button>
//           </div>

//           <form className="auth-form">
//             {activeTab === 'signup' && (
//               <>
//                 <label>Name</label>
//                 <input type="text" placeholder="Your name" />
//               </>
//             )}

//             <label>Email</label>
//             <input type="email" placeholder="m@example.com" />

//             <label>Password</label>
//             <input type="password" placeholder="••••••••" />

//             {activeTab === 'login' && <a href="#">Forgot password?</a>}

//             <button type="submit">
//               {activeTab === 'login' ? 'Login' : 'Sign Up'}
//             </button>
//           </form>
//         </div>

//         <div className="right-panel">
//           <h2>Learn Wikipedia Policies Through Play</h2>
//           <p>Our gamified approach makes understanding Wikipedia's guidelines fun and engaging.</p>
//           <ul>
//             <li><strong>🏆 Earn Badges</strong><br />Complete challenges to earn badges.</li>
//             <li><strong>📊 Track Progress</strong><br />Monitor your learning journey.</li>
//             <li><strong>👥 Community Leaderboard</strong><br />Compare knowledge with others.</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AuthForm;



import React from 'react';
import AuthForm from './AuthForm';
import './signin.css'; // Renamed from index.css to avoid conflicts

export default function Signin() {
  return (
    <div className="app-container">
      <AuthForm />
    </div>
  );
}
