import './App.scss';
import Layout from './components/Layout';
import Home from './components/Home';
import About from './components/About';
import Skills from './components/Skills';
import Work from './components/Work';

function App() {
  // Single continuous page: stack all sections and rely on scroll
  return (
    <Layout>
      <Home />
      <About />
      <Skills />
      <Work />
    </Layout>
  );
}

export default App;

