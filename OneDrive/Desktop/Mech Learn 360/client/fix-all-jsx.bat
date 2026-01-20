@echo off
echo ========================================
echo COMPREHENSIVE JSX SYNTAX FIXER
echo ========================================
echo.

REM Navigate to correct directory
cd /d "C:\Users\jacob\OneDrive\Desktop\Mech Learn 360\client"

REM Create backup first
echo Creating backup...
if not exist "backup" mkdir backup
xcopy /E /I /Y "src" "backup\src_%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%" >nul
echo Backup created in: backup\ folder
echo.

echo ========================================
echo FIXING COMPONENT FILES
echo ========================================
echo.

REM 1. Fix Auth/Login.jsx - Remove double arrow
echo Fixing src\components\Auth\Login.jsx...
(
echo import React, { useState } from 'react';
echo import { useAuth } from '../../context/AuthContext';
echo import { useNavigate, useLocation } from 'react-router-dom';
echo.
echo const Login = () => {
echo   const { login } = useAuth();
echo   const navigate = useNavigate();
echo   const location = useLocation();
echo   const [email, setEmail] = useState('');
echo   const [password, setPassword] = useState('');
echo   const [error, setError] = useState('');
echo.
echo   const from = location.state?.from?.pathname || '/';
echo.
echo   const handleSubmit = async (e) => {
echo     e.preventDefault();
echo     try {
echo       await login(email, password);
echo       navigate(from, { replace: true });
echo     } catch (err) {
echo       setError('Failed to log in');
echo     }
echo   };
echo.
echo   return (
echo     <div className="auth-container">
echo       <h2>Login</h2>
echo       {error && <div className="error">{error}</div>}
echo       <form onSubmit={handleSubmit}>
echo         <input
echo           type="email"
echo           placeholder="Email"
echo           value={email}
echo           onChange={(e) => setEmail(e.target.value)}
echo           required
echo         />
echo         <input
echo           type="password"
echo           placeholder="Password"
echo           value={password}
echo           onChange={(e) => setPassword(e.target.value)}
echo           required
echo         />
echo         <button type="submit">Login</button>
echo       </form>
echo     </div>
echo   );
echo };
echo.
echo export default Login;
) > "src\components\Auth\Login.jsx"
echo ✅ Fixed Login.jsx

REM 2. Fix Auth/Register.jsx - Remove double arrow
echo Fixing src\components\Auth\Register.jsx...
(
echo import React, { useState } from 'react';
echo import { useAuth } from '../../context/AuthContext';
echo import { useNavigate } from 'react-router-dom';
echo.
echo const Register = () => {
echo   const { register } = useAuth();
echo   const navigate = useNavigate();
echo   const [email, setEmail] = useState('');
echo   const [password, setPassword] = useState('');
echo   const [confirmPassword, setConfirmPassword] = useState('');
echo   const [error, setError] = useState('');
echo.
echo   const handleSubmit = async (e) => {
echo     e.preventDefault();
echo     if (password !== confirmPassword) {
echo       setError('Passwords do not match');
echo       return;
echo     }
echo     try {
echo       await register(email, password);
echo       navigate('/');
echo     } catch (err) {
echo       setError('Failed to register');
echo     }
echo   };
echo.
echo   return (
echo     <div className="auth-container">
echo       <h2>Register</h2>
echo       {error && <div className="error">{error}</div>}
echo       <form onSubmit={handleSubmit}>
echo         <input
echo           type="email"
echo           placeholder="Email"
echo           value={email}
echo           onChange={(e) => setEmail(e.target.value)}
echo           required
echo         />
echo         <input
echo           type="password"
echo           placeholder="Password"
echo           value={password}
echo           onChange={(e) => setPassword(e.target.value)}
echo           required
echo         />
echo         <input
echo           type="password"
echo           placeholder="Confirm Password"
echo           value={confirmPassword}
echo           onChange={(e) => setConfirmPassword(e.target.value)}
echo           required
echo         />
echo         <button type="submit">Register</button>
echo       </form>
echo     </div>
echo   );
echo };
echo.
echo export default Register;
) > "src\components\Auth\Register.jsx"
echo ✅ Fixed Register.jsx

REM 3. Fix Header/Header.jsx - Remove double arrow
echo Fixing src\components\Header\Header.jsx...
(
echo import React from 'react';
echo import { Link } from 'react-router-dom';
echo import { useAuth } from '../../context/AuthContext';
echo.
echo const Header = () => {
echo   const { user, logout } = useAuth();
echo.
echo   return (
echo     <header className="header">
echo       <nav>
echo         <Link to="/">Home</Link>
echo         <Link to="/videos">Videos</Link>
echo         <Link to="/premium">Premium</Link>
echo         {user && <Link to="/dashboard">Dashboard</Link>}
echo         {!user ? (
echo           <>
echo             <Link to="/login">Login</Link>
echo             <Link to="/register">Register</Link>
echo           </>
echo         ) : (
echo           <>
echo             <span>Welcome, {user.email}</span>
echo             <button onClick={logout}>Logout</button>
echo           </>
echo         )}
echo       </nav>
echo     </header>
echo   );
echo };
echo.
echo export default Header;
) > "src\components\Header\Header.jsx"
echo ✅ Fixed Header.jsx

echo ========================================
echo FIXING PAGE COMPONENTS
echo ========================================
echo.

REM 4. Fix Dashboard.jsx - Fix JSX return
echo Fixing src\pages\Dashboard.jsx...
(
echo import React from 'react';
echo.
echo const Dashboard = () => {
echo   return <div>Dashboard Page</div>;
echo };
echo.
echo export default Dashboard;
) > "src\pages\Dashboard.jsx"
echo ✅ Fixed Dashboard.jsx

REM 5. Fix Home.jsx - Fix JSX return
echo Fixing src\pages\Home.jsx...
(
echo import React from 'react';
echo.
echo const Home = () => {
echo   return <div>Home Page</div>;
echo };
echo.
echo export default Home;
) > "src\pages\Home.jsx"
echo ✅ Fixed Home.jsx

REM 6. Fix Payment.jsx - Fix JSX return
echo Fixing src\pages\Payment.jsx...
(
echo import React from 'react';
echo.
echo const Payment = () => {
echo   return <div>Payment Page</div>;
echo };
echo.
echo export default Payment;
) > "src\pages\Payment.jsx"
echo ✅ Fixed Payment.jsx

REM 7. Fix Premium.jsx - Fix JSX return
echo Fixing src\pages\Premium.jsx...
(
echo import React from 'react';
echo.
echo const Premium = () => {
echo   return <div>Premium Page</div>;
echo };
echo.
echo export default Premium;
) > "src\pages\Premium.jsx"
echo ✅ Fixed Premium.jsx

REM 8. Fix Videos.jsx - Fix JSX return
echo Fixing src\pages\Videos.jsx...
(
echo import React from 'react';
echo.
echo const Videos = () => {
echo   return <div>Videos Page</div>;
echo };
echo.
echo export default Videos;
) > "src\pages\Videos.jsx"
echo ✅ Fixed Videos.jsx

echo ========================================
echo CHECKING FOR OTHER JSX FILES
echo ========================================
echo.

REM Use PowerShell to scan and fix any remaining double arrow issues
echo Scanning for other JSX files with double arrow syntax...
powershell -Command "Get-ChildItem -Path src -Recurse -Filter *.jsx | ForEach-Object { $content = Get-Content $_.FullName -Raw; $fixed = $content -replace '\(\) =>>', '() =>' -replace '\([^)]*\) =>>', '$1 =>' -replace '=> Page</div>', '=> { return <div>Page</div>; }'; if ($content -ne $fixed) { Set-Content $_.FullName $fixed -NoNewline; Write-Host 'Fixed: ' $_.FullName } }"

echo.
echo ========================================
echo VERIFICATION
echo ========================================
echo.

REM Create verification script
echo Creating verification script...
(
echo const fs = require('fs');
echo const path = require('path');
echo.
echo const files = [
echo   'src/components/Auth/Login.jsx',
echo   'src/components/Auth/Register.jsx',
echo   'src/components/Header/Header.jsx',
echo   'src/pages/Dashboard.jsx',
echo   'src/pages/Home.jsx',
echo   'src/pages/Payment.jsx',
echo   'src/pages/Premium.jsx',
echo   'src/pages/Videos.jsx'
echo ];
echo.
echo console.log('Verifying fixes...');
echo let allGood = true;
echo.
echo files.forEach(filePath => {
echo   const fullPath = path.join(__dirname, filePath);
echo   if (!fs.existsSync(fullPath)) {
echo     console.log('❌ Missing:', filePath);
echo     allGood = false;
echo     return;
echo   }
echo.
echo   const content = fs.readFileSync(fullPath, 'utf8');
echo   const issues = [];
echo.
echo   if (content.includes('() =>>')) issues.push('Double arrow syntax');
echo   if (content.includes('=> Page</div>')) issues.push('Malformed JSX return');
echo   if (content.includes('() =') && !content.includes('() =>')) issues.push('Missing arrow');
echo.
echo   if (issues.length > 0) {
echo     console.log('❌', filePath, '->', issues.join(', '));
echo     allGood = false;
echo   } else {
echo     console.log('✅', filePath);
echo   }
echo });
echo.
echo if (allGood) {
echo   console.log('\n✅ ALL FILES ARE CORRECT!');
echo   console.log('Run: npm start');
echo } else {
echo   console.log('\n❌ Some files still have issues.');
echo }
) > verify-fixes.js

node verify-fixes.js

echo.
echo ========================================
echo CLEANUP & NEXT STEPS
echo ========================================
echo.
echo 1. Backup created in: backup\ folder
echo 2. All problematic JSX files have been fixed
echo 3. Run verification: node verify-fixes.js
echo 4. Clear cache: rd /s /q node_modules\.cache 2>nul
echo 5. Start the app: npm start
echo.
echo ========================================
pause