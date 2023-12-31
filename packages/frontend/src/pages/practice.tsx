import { useEffect, useState } from "react";
import { Card, Group, Loader, Overlay, Text } from "@mantine/core";
import PracticeTypewriteQuiz from "../components/PracticeTypewriteQuiz";
import useQuizzes from "../hooks/useQuizzes";
import { KeywordOption } from "../types";
import FilteringModal from "../components/FilteringModal";
import { useTimer, useTypewriter } from "../hooks";
import { useDisclosure } from "@mantine/hooks";
import { PracticeQuizIntro } from "../components/PracticeQuizIntro";
import { PracticeQuizInfo } from "../components/PracticeQuizInfo";
import { PracticeQuizController } from "../components/PracticeQuizController";
import axios from "../plugins/axios";
import PracticeQuitModal from "../components/PracticeQuitModal";
import { useNavigate } from "react-router-dom";
import PracticeResultModal  from "../components/PracticeResultModal";

export default function Practice() {
  // const [ params, setParams ] = useState<QuizRequestParams | null>(null);
  const [ nowNumber, setNowNumber ] = useState(0);
  const [ shouldFetch, setShouldFetch ] = useState(false);
  const [ scene, setScene ] = useState(0);
  const [ filtering, filter ] = useDisclosure(false);
  const [ resulted, result ] = useDisclosure(false);
  const { quizzes, params, setParams } = useQuizzes(undefined, '', shouldFetch);
  const [ rightList, setRightList ] = useState<number[]>([]);
  const [ pressedWord, setPressedWord ] = useState(0);
  const navigator = useNavigate();

  const size = !!quizzes ? quizzes.length : 0;
  const quiz = !!quizzes ? quizzes[nowNumber] : null;

  const delay = useTimer(500, 100, () => setScene(1)); 
  const typewriter = useTypewriter(quiz?.question || "", 100, () => setScene(2));
  const countdown = useTimer(4000, 1000, () => setScene(4)); 
  const through = useTimer(3000, 100, () => setScene(4)); 

  useEffect(() => {
    switch(scene) {
      case 0: 
        delay.reset();
        typewriter.reset();
        countdown.reset();
        through.reset();
        result.close();
        break;
      case 1:
        typewriter.start();
        break;
      case 2:
        through.start();
        break;
      case 3:
        through.pause();
        typewriter.pause();
        countdown.start();
        setPressedWord(typewriter.text.length);
        break;
      case 4:
        through.stop();
        typewriter.stop()
        break;
      case 5:
        result.open();
    }
  }, [scene]);
  
  useEffect(() => {
    filter.open();
    setScene(0);
    return () => setScene(0);
  },[]);

  const toFilter = (
    workbooks?: string[], 
    levels?: string[], 
    keyword?: string, 
    keywordOption?: KeywordOption,
    perPage?: number,
  ) => {
    const seed = Math.floor(Math.random() * 100000);
    setParams({ 
      ...params, 
      page: 1, 
      perPage,
      seed,
      workbooks, 
      levels, 
      keyword, 
      keywordOption
    });
    filter.close();
    setShouldFetch(true);
    setNowNumber(0);
    setScene(0);
  }

  const record = async (judgement: number) => {
    if (judgement == 1) {
      await axios.post('/answers', {
        quizId: quiz?.id,
        length: pressedWord,
      });
      const addId = quiz?.id
      !!addId ? setRightList([ ...rightList, addId ]) : null;
    }

    await axios.post('/histories', {
      quizId: quiz?.id,
      judgement,
    });
  }

  const judgeQuiz = (judgement: number) => {
    record(judgement);
    setNowNumber(nowNumber+1);
    
    if (nowNumber >= (size-1)) {
      setScene(5);
    } else { 
      setScene(0);
    }
  }

  const stopQuiz = async (judgement: number) => {
    await record(judgement);
    navigator('/');
  }

  return (
    <>
      { 
        scene == 0 ? 
          <Overlay fixed center>
            { 
              !quiz ? 
                <Loader variant="dots"/> 
              : 
                <PracticeQuizIntro 
                  ta="center"
                  onFinish={delay.start}
                />
            }
          </Overlay> 
        : null
      }
      <PracticeResultModal
        rightTotal={rightList.length}
        quizzesTotal={quizzes?.length || 1}
        opened={resulted}
        onClose={result.close}
        onRetry={() => setScene(0)}
        onTry={filter.open}
        onQuit={() => navigator('/')}
      />
      <Group position="apart">
        <FilteringModal
          apply={toFilter}
          opened={filtering}
          onOpen={filter.open}
          onClose={!!params ? filter.close : toFilter}
        />
        <PracticeQuitModal
          onJudge={(j) => stopQuiz(j)}
        />
      </Group>
      <Text ta="center">
        <Text span fz={38} fw={700} >{ nowNumber+1 }</Text> 
        <Text span fz={18} fw={500}> / { size }</Text>
      </Text>
      <Card p="md" radius="lg" withBorder>
        <PracticeTypewriteQuiz
          question={typewriter.text}
          visible={scene != 3}
          time={through.time}
          count={countdown.time}
          countlimit={4000}
        />
        <PracticeQuizInfo 
          quizId={quiz?.id}
          answer={quiz?.answer}
          workbook={quiz?.workbook }
          level={quiz?.level}
          date={quiz?.date}
          isFavorite={quiz?.isFavorite}
          registeredMylist={quiz?.registerdMylist}
          visible={scene >= 4}
        />
      </Card>
      <PracticeQuizController
        canJudge={scene == 4}
        canPress={scene == 1 || scene == 2}
        onJudge={(j) => judgeQuiz(j)}
        onPress={() => setScene(3)}
        m="sm"
      />
    </>
  )
}