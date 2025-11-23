import React, { useState } from 'react';
import { Mail, Flag, CheckCircle, XCircle, Trophy, Shield, Search, Settings, Menu, Star, Archive, Trash2, Share2, Download, X, ChevronLeft } from 'lucide-react';

const PhishingGame = () => {
  const [screen, setScreen] = useState('welcome');
  const [userName, setUserName] = useState('');
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [completedEmails, setCompletedEmails] = useState([]);
  const [failureReason, setFailureReason] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const emails = [
    {
      id: 1,
      from: 'IT Support',
      email: 'itsupport@cloudcorp.xyz',
      subject: 'Urgent: Password Expiration Notice',
      preview: 'Your password will expire in 24 hours...',
      time: '9:34 AM',
      body: `Dear Employee,

Your Cloud Corp password will expire in 24 hours. Please click the link below to update your password immediately to avoid account suspension.

Update Password Now: http://cloudcorp-security.net/reset

Failure to update will result in account lockout.

Best regards,
IT Security Team
Cloud Corp`,
      isPhishing: true,
      redFlags: ['Urgency/pressure', 'Suspicious link (cloudcorp-security.net instead of cloudcorp.xyz)', 'Threatens account suspension'],
      explanation: 'This is a PHISHING attempt! The link goes to "cloudcorp-security.net" instead of the legitimate "cloudcorp.xyz" domain. Real IT departments never pressure you with urgent password changes via email.'
    },
    {
      id: 2,
      from: 'HR Department',
      email: 'hr@cloudcorp.xyz',
      subject: 'Q4 Benefits Enrollment Reminder',
      preview: 'Reminder to complete your benefits enrollment...',
      time: '8:52 AM',
      body: `Hello Team,

This is a friendly reminder that Q4 benefits enrollment closes on November 30th. Please log into the employee portal at your convenience to review and update your selections.

If you have questions, please contact HR at extension 2500.

Best regards,
Human Resources
Cloud Corp`,
      isPhishing: false,
      redFlags: [],
      explanation: 'This is a LEGITIMATE email. It comes from the correct domain (@cloudcorp.xyz), has no suspicious links, uses professional language, and provides internal contact information without urgency.'
    },
    {
      id: 3,
      from: 'Sarah Chen',
      email: 'sarah.chen@cloudcorp.xyz',
      subject: 'URGENT: Wire Transfer Needed',
      preview: 'I need you to process a wire transfer immediately...',
      time: '7:15 AM',
      body: `Hi,

I'm in a meeting with clients and need you to process an urgent wire transfer for $25,000 to our vendor. I'll send the account details separately.

Please handle this ASAP - very time sensitive.

Sarah Chen
CEO, Cloud Corp

Sent from my iPhone`,
      isPhishing: true,
      redFlags: ['CEO requesting unusual action via email', 'Urgency without proper verification', 'Wire transfer request', 'Unusual request pattern'],
      explanation: 'This is a PHISHING attempt using CEO fraud (whaling)! Even though the email address looks correct, attackers can spoof sender addresses. CEOs never request wire transfers via casual email. Always verify through a separate communication channel.'
    },
    {
      id: 4,
      from: 'Microsoft Security',
      email: 'security-alert@microsoft-security.com',
      subject: 'Security Alert: Unusual Sign-In Activity',
      preview: 'We detected unusual activity on your Microsoft account...',
      time: 'Yesterday',
      body: `Microsoft Account Security Alert

We detected an unusual sign-in attempt to your Microsoft account from an unrecognized device in Russia.

Account: ${userName || 'austen'}@cloudcorp.xyz
Time: November 20, 2025 3:42 AM
Location: Moscow, Russia

If this wasn't you, please verify your account immediately:
Secure My Account: http://microsoft-verify.com/security

This link expires in 2 hours.

Microsoft Security Team`,
      isPhishing: true,
      redFlags: ['From external domain (not @microsoft.com)', 'Suspicious link (microsoft-verify.com)', 'Creates panic with foreign login', 'Time pressure'],
      explanation: 'This is a PHISHING attempt! The email comes from "microsoft-security.com" not the legitimate "@microsoft.com" domain. Microsoft never sends security alerts from third-party domains. Always go directly to the official website instead of clicking links.'
    },
    {
      id: 5,
      from: 'Finance Team',
      email: 'finance@cloudcorp.xyz',
      subject: 'November Expense Reports Due',
      preview: 'Please submit your expense reports by Friday...',
      time: 'Yesterday',
      body: `Team,

Just a reminder that November expense reports are due this Friday, November 22nd.

Please submit through the usual portal. Contact finance@cloudcorp.xyz if you have any questions.

Thanks,
Finance Department`,
      isPhishing: false,
      redFlags: [],
      explanation: 'This is a LEGITIMATE email. It comes from the correct internal domain, references normal business processes, and provides appropriate contact information without suspicious links or urgency.'
    },
    {
      id: 6,
      from: 'Amazon Web Services',
      email: 'noreply@aws-notify.com',
      subject: 'Your AWS Bill is Ready',
      preview: 'Your AWS invoice for November is available...',
      time: 'Nov 18',
      body: `Hello,

Your AWS invoice for November 2025 is now available.

Amount Due: $8,453.23
Due Date: December 5, 2025

View Invoice: http://aws-billing.net/invoice/view?id=8823441

If you have questions about your bill, please contact AWS Support.

Amazon Web Services`,
      isPhishing: true,
      redFlags: ['Suspicious sender domain (@aws-notify.com)', 'Fake billing link (aws-billing.net)', 'Not from official @amazon.com or @aws.amazon.com'],
      explanation: 'This is a PHISHING attempt! AWS emails come from @amazon.com or @aws.amazon.com domains, not "aws-notify.com". The billing link also goes to a suspicious domain. Always access billing through the official AWS console.'
    },
    {
      id: 7,
      from: 'IT Department',
      email: 'it@cloudcorp.xyz',
      subject: 'Scheduled Maintenance - November 25th',
      preview: 'Email systems will be down for maintenance...',
      time: 'Nov 18',
      body: `Dear Cloud Corp Team,

Please be advised that we will be performing scheduled maintenance on our email systems on November 25th from 2:00 AM to 6:00 AM EST.

During this time, email services may be intermittently unavailable. All other systems will remain operational.

We appreciate your patience.

IT Department
Cloud Corp`,
      isPhishing: false,
      redFlags: [],
      explanation: 'This is a LEGITIMATE email. It comes from the internal IT department, provides specific details about scheduled maintenance, and doesn\'t request any action or contain suspicious links.'
    },
    {
      id: 8,
      from: 'LinkedIn',
      email: 'notifications@linkedin.com',
      subject: 'You appeared in 47 searches this week',
      preview: 'See who\'s viewing your profile...',
      time: 'Nov 17',
      body: `Hi ${userName || 'there'},

Your profile appeared in 47 searches this week! See who's interested in your professional background.

View Profile Viewers: http://linkedin-premium.net/profile/viewers

Upgrade to Premium to see everyone who viewed your profile and unlock exclusive features.

Best,
The LinkedIn Team`,
      isPhishing: true,
      redFlags: ['Link goes to linkedin-premium.net (not linkedin.com)', 'Suspicious third-party domain', 'Tries to capitalize on curiosity'],
      explanation: 'This is a PHISHING attempt! While the sender shows "@linkedin.com", the link goes to "linkedin-premium.net" which is NOT LinkedIn\'s official domain. Real LinkedIn notifications always link to linkedin.com.'
    },
    {
      id: 9,
      from: userName || 'You',
      email: `${userName || 'austen'}@cloudcorp.xyz`,
      subject: 'Fwd: Meeting Notes',
      preview: 'Can you review these notes from yesterday?',
      time: 'Nov 17',
      body: `Hi,

I'm forwarding the notes from yesterday's client meeting. Can you review and let me know if I missed anything?

📎 Meeting_Notes_Nov19.pdf.exe (2.4 MB)

Thanks!

[This email appears to be from your own address]`,
      isPhishing: true,
      redFlags: ['Email spoofing (from your own address)', 'Suspicious file extension (.pdf.exe)', 'Double extension is classic malware technique'],
      explanation: 'This is a PHISHING attempt using email spoofing! Attackers made it appear to come from your own address. The file "Meeting_Notes_Nov19.pdf.exe" is malware - the .exe extension reveals it\'s an executable, not a PDF. Never trust the sender address alone.'
    },
    {
      id: 10,
      from: 'Marketing Team',
      email: 'marketing@cloudcorp.xyz',
      subject: 'New Brand Guidelines Available',
      preview: 'Updated brand guidelines for 2025...',
      time: 'Nov 16',
      body: `Hi Team,

Our updated brand guidelines for 2025 are now available on the company intranet under Resources > Marketing > Brand Guidelines.

These include new logo variations, color palettes, and typography standards. Please review before your next project.

Questions? Reach out to the marketing team.

Best,
Marketing Department`,
      isPhishing: false,
      redFlags: [],
      explanation: 'This is a LEGITIMATE email. It comes from the internal marketing team, references internal resources on the company intranet (not external links), and follows normal business communication patterns.'
    }
  ];

  const startGame = () => {
    if (userName.trim()) {
      setScreen('inbox');
    }
  };

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    setScreen('email');
  };

  const handleReportPhishing = () => {
    const email = emails[currentEmailIndex];
    const newCompleted = [...completedEmails, { id: email.id, correct: email.isPhishing }];
    setCompletedEmails(newCompleted);
    
    if (email.isPhishing) {
      if (currentEmailIndex < emails.length - 1) {
        setCurrentEmailIndex(currentEmailIndex + 1);
        setSelectedEmail(null);
        setScreen('correct');
        setScore(score + 1);
      } else {
        setScreen('victory');
        setScore(score + 1);
      }
    } else {
      setFailureReason(email.explanation);
      setScreen('failure');
    }
  };

  const handleTrustEmail = () => {
    const email = emails[currentEmailIndex];
    const newCompleted = [...completedEmails, { id: email.id, correct: !email.isPhishing }];
    setCompletedEmails(newCompleted);
    
    if (!email.isPhishing) {
      if (currentEmailIndex < emails.length - 1) {
        setCurrentEmailIndex(currentEmailIndex + 1);
        setSelectedEmail(null);
        setScreen('correct');
        setScore(score + 1);
      } else {
        setScreen('victory');
        setScore(score + 1);
      }
    } else {
      setFailureReason(email.explanation);
      setScreen('failure');
    }
  };

  const resetGame = () => {
    setCurrentEmailIndex(0);
    setScore(0);
    setSelectedEmail(null);
    setCompletedEmails([]);
    setFailureReason('');
    setScreen('inbox');
  };

  const generateScoreBadge = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 600, 400);
    gradient.addColorStop(0, score === 10 ? '#fbbf24' : score >= 5 ? '#4f46e5' : '#ef4444');
    gradient.addColorStop(1, score === 10 ? '#f59e0b' : score >= 5 ? '#6366f1' : '#dc2626');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 400);

    ctx.fillStyle = 'white';
    ctx.fillRect(40, 40, 520, 320);

    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Cloud Corp Security Training', 300, 100);

    ctx.font = 'bold 72px Arial';
    ctx.fillStyle = score === 10 ? '#10b981' : score >= 5 ? '#4f46e5' : '#ef4444';
    ctx.fillText(`${score}/10`, 300, 200);

    ctx.font = '24px Arial';
    ctx.fillStyle = '#6b7280';
    const status = score === 10 ? 'Perfect Score!' : score >= 5 ? 'Great Job!' : 'Keep Practicing!';
    ctx.fillText(status, 300, 250);

    ctx.font = '20px Arial';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(`${userName}@cloudcorp.xyz`, 300, 300);

    return canvas.toDataURL('image/png');
  };

  const downloadBadge = () => {
    const dataUrl = generateScoreBadge();
    const link = document.createElement('a');
    link.download = `cloudcorp-security-score-${score}.png`;
    link.href = dataUrl;
    link.click();
  };

  const shareBadge = async () => {
    const dataUrl = generateScoreBadge();
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `cloudcorp-security-score-${score}.png`, { type: 'image/png' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'My Cloud Corp Security Score',
          text: `I scored ${score}/10 on the Cloud Corp Phishing Awareness Test!`,
          files: [file]
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      downloadBadge();
    }
  };

  if (screen === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Cloud Corp</h1>
            <h2 className="text-lg sm:text-xl font-semibold text-indigo-600 mb-4">Phishing Awareness Test</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-2">Test your ability to spot phishing emails and protect Cloud Corp from cyber threats!</p>
            <p className="text-xs sm:text-sm text-gray-600">This app was made by <a href="https://austen.cloud-local.ca/" target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>Austen Young</a></p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && startGame()}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
            />
            <p className="text-xs text-gray-500 mt-1">You'll be logged in as: {userName ? `${userName}@cloudcorp.xyz` : 'yourname@cloudcorp.xyz'}</p>
          </div>

          <button
            onClick={startGame}
            disabled={!userName.trim()}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-base"
          >
            Start Test
          </button>

          <div className="mt-4 sm:mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-yellow-800 mb-2 text-sm sm:text-base">How to Play:</h3>
            <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
              <li>• Review each email carefully</li>
              <li>• Click "Report Phishing" if suspicious</li>
              <li>• Click "Trust Email" if legitimate</li>
              <li>• One wrong answer ends the game!</li>
              <li>• Perfect score: 10/10</li>
            </ul>
          </div>

          <div className="mt-4 sm:mt-6 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">⚠️ IMPORTANT NOTICE:</h3>
            <ul className="text-xs sm:text-sm text-red-700 space-y-1">
              <li>• This game is <strong>entirely a simulation,</strong> and is meant for <strong>educational purposes only.</strong></li>
              <li>• Do <strong>not click any links</strong> in the emails. They are simulated and may point to non-existent or unsafe domains.</li>
              <li>• All companies, people, and emails in this game are <strong>fictional or used for training purposes only</strong>. Any resemblance to real entities is coincidental.</li>
              <li>• This is a safe simulation - your accounts are <strong>not affected</strong></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'inbox') {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden"
                >
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                <span className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800">Cloud Corp Mail</span>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 hidden sm:block" />
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-semibold">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-sm text-gray-700">{userName}@cloudcorp.xyz</span>
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600 sm:hidden">
              {userName}@cloudcorp.xyz
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {showMobileMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setShowMobileMenu(false)}>
            <div className="w-64 bg-white h-full p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-800">Menu</span>
                <button onClick={() => setShowMobileMenu(false)}>
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <nav className="space-y-1 mb-6">
                <div className="flex items-center space-x-3 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium">
                  <Mail className="w-5 h-5" />
                  <span>Inbox</span>
                  <span className="ml-auto text-sm">{emails.length - currentEmailIndex}</span>
                </div>
                <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 rounded-lg">
                  <Star className="w-5 h-5" />
                  <span>Starred</span>
                </div>
                <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 rounded-lg">
                  <Archive className="w-5 h-5" />
                  <span>Archive</span>
                </div>
                <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                  <span>Trash</span>
                </div>
              </nav>

              {/* Progress Tracker */}
              <div className="pt-6 border-t border-gray-200">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Progress</span>
                  <span className="text-sm text-gray-500">{completedEmails.length}/10</span>
                </div>
                <div className="space-y-2">
                  {emails.map((email, idx) => (
                    <div key={email.id} className="flex items-center space-x-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        completedEmails.find(c => c.id === email.id) 
                          ? completedEmails.find(c => c.id === email.id).correct
                            ? 'bg-green-100'
                            : 'bg-red-100'
                          : idx === currentEmailIndex
                          ? 'bg-indigo-100'
                          : 'bg-gray-100'
                      }`}>
                        {completedEmails.find(c => c.id === email.id) ? (
                          completedEmails.find(c => c.id === email.id).correct ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )
                        ) : (
                          <span className="text-xs text-gray-600">{idx + 1}</span>
                        )}
                      </div>
                      <span className={`text-xs ${
                        idx === currentEmailIndex ? 'text-indigo-600 font-medium' : 'text-gray-500'
                      }`}>
                        Email {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score Display */}
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                <div className="text-sm text-indigo-600 font-semibold mb-1">Security Score</div>
                <div className="text-2xl font-bold text-indigo-700">{score}/10</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 bg-white border-r border-gray-200 p-4" style={{ height: 'calc(100vh - 60px)' }}>
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg mb-4 hover:bg-indigo-700 transition">
              Compose
            </button>
            <nav className="space-y-1 mb-6">
              <div className="flex items-center space-x-3 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium">
                <Mail className="w-5 h-5" />
                <span>Inbox</span>
                <span className="ml-auto text-sm">{emails.length - currentEmailIndex}</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                <Star className="w-5 h-5" />
                <span>Starred</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                <Archive className="w-5 h-5" />
                <span>Archive</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                <Trash2 className="w-5 h-5" />
                <span>Trash</span>
              </div>
            </nav>

            {/* Progress Tracker */}
            <div className="pt-6 border-t border-gray-200">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">{completedEmails.length}/10</span>
              </div>
              <div className="space-y-2">
                {emails.map((email, idx) => (
                  <div key={email.id} className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      completedEmails.find(c => c.id === email.id) 
                        ? completedEmails.find(c => c.id === email.id).correct
                          ? 'bg-green-100'
                          : 'bg-red-100'
                        : idx === currentEmailIndex
                        ? 'bg-indigo-100'
                        : 'bg-gray-100'
                    }`}>
                      {completedEmails.find(c => c.id === email.id) ? (
                        completedEmails.find(c => c.id === email.id).correct ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )
                      ) : (
                        <span className="text-xs text-gray-600">{idx + 1}</span>
                      )}
                    </div>
                    <span className={`text-xs ${
                      idx === currentEmailIndex ? 'text-indigo-600 font-medium' : 'text-gray-500'
                    }`}>
                      Email {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Display */}
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
              <div className="text-sm text-indigo-600 font-semibold mb-1">Security Score</div>
              <div className="text-2xl font-bold text-indigo-700">{score}/10</div>
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 bg-white">
            <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">Primary</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {emails.slice(currentEmailIndex, currentEmailIndex + 3).map((email, idx) => (
                <div
                  key={email.id}
                  onClick={() => idx === 0 && handleEmailClick(email)}
                  className={`px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition ${
                    idx === 0 ? 'cursor-pointer bg-blue-50' : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-xs sm:text-sm">
                          {email.from.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{email.from}</span>
                        <span className="text-xs sm:text-sm text-gray-500 ml-2">{email.time}</span>
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1 truncate">{email.subject}</div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">{email.preview}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'email') {
    const email = emails[currentEmailIndex];
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setScreen('inbox')}
                  className="lg:hidden"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                <span className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800">Cloud Corp Mail</span>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 hidden sm:block" />
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-semibold">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-4 sm:py-6 px-4">
          <button
            onClick={() => setScreen('inbox')}
            className="hidden lg:flex text-indigo-600 hover:text-indigo-800 mb-6 items-center space-x-1 font-medium"
          >
            <span>← Back to Inbox</span>
          </button>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Email Header */}
            <div className="border-b border-gray-200 p-4 sm:p-6">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{email.subject}</h1>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-semibold text-base sm:text-lg">
                    {email.from.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0 mr-2">
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">{email.from}</div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">&lt;{email.email}&gt;</div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">{email.time}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                    to me
                  </div>
                </div>
              </div>
            </div>

            {/* Email Body */}
            <div className="p-4 sm:p-6">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-sm sm:text-base">
                  {email.body}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
              <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Is this email legitimate or a phishing attempt?</p>
              <p className="text-xs sm:text-sm font-semibold text-red-600 mb-4">⚠️ This email is part of a phishing simulation. Do not click links or download attachments.</p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleReportPhishing}
                  className="flex-1 bg-red-600 text-white py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Flag className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Report Phishing</span>
                </button>
                <button
                  onClick={handleTrustEmail}
                  className="flex-1 bg-green-600 text-white py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Trust Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'correct') {
    const email = emails[currentEmailIndex - 1];
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Correct!</h2>
            <p className="text-lg sm:text-xl text-gray-600">Good job spotting that one!</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-6">
            <h3 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Explanation:</h3>
            <p className="text-green-700 text-sm sm:text-base">{email.explanation}</p>
            
            {email.redFlags.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Red Flags:</h4>
                <ul className="list-disc list-inside text-green-700 space-y-1 text-sm sm:text-base">
                  {email.redFlags.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Score: {score}/10</p>
            <button
              onClick={() => {
                setSelectedEmail(null);
                setScreen('inbox');
              }}
              className="bg-indigo-600 text-white py-3 px-6 sm:px-8 rounded-lg font-semibold hover:bg-indigo-700 transition text-sm sm:text-base"
            >
              Continue to Next Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'failure') {
    const email = emails[currentEmailIndex];
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Incorrect!</h2>
            <p className="text-lg sm:text-xl text-gray-600">You've been compromised!</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 mb-6">
            <h3 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">What went wrong:</h3>
            <p className="text-red-700 mb-4 text-sm sm:text-base">{failureReason}</p>
            
            {email.redFlags.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">Red Flags You Missed:</h4>
                <ul className="list-disc list-inside text-red-700 space-y-1 text-sm sm:text-base">
                  {email.redFlags.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="text-center mb-6">
            <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Final Score: {score}/10</p>
            <p className="text-gray-600 text-sm sm:text-base">You completed {completedEmails.length} out of 10 emails</p>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={shareBadge}
              className="w-full bg-indigo-600 text-white py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Share Your Score</span>
            </button>
            <button
              onClick={downloadBadge}
              className="w-full bg-gray-600 text-white py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-gray-700 transition flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Download Badge</span>
            </button>
            <button
              onClick={resetGame}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-gray-50 transition text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'victory') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Perfect Score!</h2>
            <p className="text-lg sm:text-xl text-gray-600">You've successfully identified all phishing attempts!</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2 text-sm sm:text-base">Congratulations!</h3>
            <p className="text-yellow-700 text-sm sm:text-base">You've demonstrated excellent security awareness. You correctly identified all phishing attempts and legitimate emails, protecting Cloud Corp from potential cyber threats.</p>
          </div>

          <div className="text-center mb-6">
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Final Score: {score}/10</p>
            <p className="text-gray-600 text-sm sm:text-base">All 10 emails completed successfully!</p>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={shareBadge}
              className="w-full bg-indigo-600 text-white py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Share Your Achievement</span>
            </button>
            <button
              onClick={downloadBadge}
              className="w-full bg-gray-600 text-white py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-gray-700 transition flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Download Badge</span>
            </button>
            <button
              onClick={resetGame}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-gray-50 transition text-sm sm:text-base"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PhishingGame;