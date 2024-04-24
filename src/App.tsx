import styled from './App.module.css';
import Field from './components/field/field';


function App() {
  return (
    <div className="App">
      <header className={styled.header}>
        Бильярд! Можно толкать мячи и менять им цвет!
      </header>
      <main className={styled.main}>
        <Field />
      </main>
    </div>
  );
}

export default App;
