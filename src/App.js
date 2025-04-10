import './App.css';
import { Searcher } from './components/Searcher';
import InfoBlock from './components/InfoBlock';
import { RobertaAnswers } from './components/response';

const HOST_NAME = 'http://localhost:8000'
export { HOST_NAME }

function App() {
  return (
    <div className="App">
      <div className='box-preview'>
        <h1>Какую статью найдем сегодня?</h1>
        <Searcher />

        <InfoBlock
          blockname={'appinfo'}
          t={'App'}
          p={'Это приложение помогает определить быстро по какой\
            теме статья, если вы по какой-топ ричине не можете\
            найти эту информацию в интернете'
          }
          />
        <InfoBlock
          blockname={'modelinfo'}
          t={'Model'}
          p={
            'Это приложение использует предобученную \
            Roberta-модель для SequenceClassification задачи \
            '
          }
          />
        
        <p className='shadetext'>roberta's answer for found articles:</p>
        <RobertaAnswers
          />
      </div>
    </div>
  );
}

export default App;
