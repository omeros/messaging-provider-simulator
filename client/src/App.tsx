import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import SendPage from "./pages/SendPage";
import MessagesPage from "./pages/MessagesPage";



function App() {
  return (
       <div className="min-h-screen bg-slate-50">
    <Header />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/send" element={<SendPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          {/* all the rest*/}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
     </div>
  ) 
}

export default App
