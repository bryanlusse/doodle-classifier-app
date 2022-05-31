import './style/App.scss';
// import './typography/font-awesome.min.css'
import Hero from './components/Hero/Hero';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <Footer />
    </div>
  );
}

export default App;
