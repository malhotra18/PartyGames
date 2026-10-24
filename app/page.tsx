'use client';

import {
  ArrowRight,
  ArrowRightLeft,
  Check,
  CircleX,
  Eye,
  Film,
  Fullscreen,
  RotateCcw,
  Trophy,
  Undo2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { games, type ChoiceRound, type GameId } from '@/lib/games';

type Team = 'A' | 'B';
type RoundResult = { team: Team | null; points: number };
type GameProgress = {
  roundIndex: number;
  results: Array<RoundResult | null>;
  history: number[];
};

const STORAGE_KEY = 'picture-play-games-v2';
const LEGACY_STORAGE_KEY = 'picture-play-game-1';
const gameIds: GameId[] = ['game-1', 'game-2'];

function blankProgress(gameId: GameId): GameProgress {
  return {
    roundIndex: 0,
    results: Array(games[gameId].rounds.length).fill(null),
    history: [],
  };
}

function initialProgress(): Record<GameId, GameProgress> {
  return {
    'game-1': blankProgress('game-1'),
    'game-2': blankProgress('game-2'),
  };
}

function otherTeam(team: Team): Team {
  return team === 'A' ? 'B' : 'A';
}

function ChoiceSlide({
  round,
  revealed,
}: {
  round: ChoiceRound;
  revealed: boolean;
}) {
  return (
    <div className="trivia-stage">
      <div className="trivia-photo">
        <img alt="Featured Indian dish" src={round.image} />
        <div className="trivia-photo-shade" />
        <span>Taste of India</span>
      </div>
      <div className="trivia-copy">
        <p className="trivia-kicker">
          {revealed ? 'Answer revealed' : 'Choose the state'}
        </p>
        <h2>{round.question}</h2>
        <div className="trivia-options">
          {round.options.map((option, index) => {
            const isCorrect = index === round.correctIndex;
            return (
              <div
                className={`trivia-option ${
                  revealed
                    ? isCorrect
                      ? 'trivia-option-correct'
                      : 'trivia-option-muted'
                    : ''
                }`}
                key={option}
              >
                <span className="trivia-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
                {revealed && isCorrect && (
                  <Check aria-hidden="true" className="ml-auto size-5" />
                )}
              </div>
            );
          })}
        </div>
        {revealed && (
          <p aria-live="polite" className="trivia-answer">
            Correct answer: <strong>{round.options[round.correctIndex]}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<GameId>('game-1');
  const [progress, setProgress] =
    useState<Record<GameId, GameProgress>>(initialProgress);
  const [revealed, setRevealed] = useState(false);
  const [passed, setPassed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          selectedGame?: GameId;
          progress?: Partial<Record<GameId, GameProgress>>;
        };
        setProgress((current) => {
          const restored = { ...current };
          for (const gameId of gameIds) {
            const candidate = parsed.progress?.[gameId];
            if (
              candidate &&
              Array.isArray(candidate.results) &&
              candidate.results.length === games[gameId].rounds.length
            ) {
              restored[gameId] = candidate;
            }
          }
          return restored;
        });
        if (parsed.selectedGame && gameIds.includes(parsed.selectedGame)) {
          setSelectedGame(parsed.selectedGame);
        }
      } else {
        const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacy) {
          const parsed = JSON.parse(legacy) as Partial<GameProgress>;
          if (
            Array.isArray(parsed.results) &&
            parsed.results.length === games['game-1'].rounds.length
          ) {
            setProgress((current) => ({
              ...current,
              'game-1': {
                roundIndex: parsed.roundIndex ?? 0,
                results: parsed.results!,
                history: parsed.history ?? [],
              },
            }));
          }
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selectedGame, progress }),
    );
  }, [hydrated, progress, selectedGame]);

  const game = games[selectedGame];
  const currentProgress = progress[selectedGame];
  const { roundIndex, results, history } = currentProgress;
  const round = game.rounds[roundIndex];
  const totalRounds = game.rounds.length;
  const roundResult = results[roundIndex];
  const completedCount = results.filter(Boolean).length;
  const gameComplete = completedCount === totalRounds;
  const starter: Team = roundIndex % 2 === 0 ? 'A' : 'B';
  const activeTeam = passed ? otherTeam(starter) : starter;
  const availablePoints = passed ? 10 : 20;

  const scores = useMemo(
    () =>
      results.reduce<{ A: number; B: number }>(
        (total, result) => {
          if (result?.team) total[result.team] += result.points;
          return total;
        },
        { A: 0, B: 0 },
      ),
    [results],
  );

  function updateCurrentProgress(
    update: (current: GameProgress) => GameProgress,
  ) {
    setProgress((current) => ({
      ...current,
      [selectedGame]: update(current[selectedGame]),
    }));
  }

  function selectGame(gameId: GameId) {
    setSelectedGame(gameId);
    setRevealed(false);
    setPassed(false);
  }

  function goToRound(nextRound: number) {
    const safeRound = Math.max(0, Math.min(totalRounds - 1, nextRound));
    updateCurrentProgress((current) => ({
      ...current,
      roundIndex: safeRound,
    }));
    setRevealed(false);
    setPassed(false);
  }

  function recordResult(points: number) {
    if (roundResult) return;
    const result: RoundResult = {
      team: points > 0 ? activeTeam : null,
      points,
    };
    updateCurrentProgress((current) => ({
      ...current,
      results: current.results.map((item, index) =>
        index === roundIndex ? result : item,
      ),
      history: [...current.history, roundIndex],
    }));
  }

  function undoLastResult() {
    const lastRound = history.at(-1);
    if (lastRound === undefined) return;
    updateCurrentProgress((current) => ({
      roundIndex: lastRound,
      results: current.results.map((item, index) =>
        index === lastRound ? null : item,
      ),
      history: current.history.slice(0, -1),
    }));
    setPassed(false);
    setRevealed(true);
  }

  function resetGame() {
    if (
      completedCount > 0 &&
      !window.confirm(`Reset ${game.title} and clear both team scores?`)
    ) {
      return;
    }
    setProgress((current) => ({
      ...current,
      [selectedGame]: blankProgress(selectedGame),
    }));
    setRevealed(false);
    setPassed(false);
  }

  async function enterFullscreen() {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-background/95 px-4 py-3 backdrop-blur-xl lg:px-7">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-3">
          <div className="mr-auto flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_30px_rgba(255,82,112,.25)]">
              <Film aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
                Host console
              </p>
              <h1 className="text-lg font-black leading-tight tracking-tight">
                Picture Play
              </h1>
            </div>
          </div>

          <NativeSelect
            aria-label="Choose a game"
            className="order-3 w-full sm:order-none sm:w-auto"
            onChange={(event) => selectGame(event.target.value as GameId)}
            value={selectedGame}
          >
            <NativeSelectOption value="game-1">
              Game 1 · Guess the Movie
            </NativeSelectOption>
            <NativeSelectOption value="game-2">
              Game 2 · Taste of India
            </NativeSelectOption>
            <NativeSelectOption disabled value="game-3">
              Game 3 · Coming soon
            </NativeSelectOption>
            <NativeSelectOption disabled value="game-4">
              Game 4 · Coming soon
            </NativeSelectOption>
          </NativeSelect>

          <div
            aria-label={`Score: Team A ${scores.A}, Team B ${scores.B}`}
            aria-live="polite"
            className="flex items-stretch gap-2"
          >
            <div className="score-chip score-chip-a">
              <span>Team A</span><strong>{scores.A}</strong>
            </div>
            <div className="score-chip score-chip-b">
              <span>Team B</span><strong>{scores.B}</strong>
            </div>
          </div>

          <Button
            aria-label="Enter fullscreen"
            className="hidden sm:inline-flex"
            onClick={enterFullscreen}
            size="icon-lg"
            variant="outline"
          >
            <Fullscreen aria-hidden="true" />
          </Button>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-[1600px] gap-5 p-3 sm:p-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-6">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-[22px] border border-white/10 bg-black shadow-[0_28px_80px_rgba(0,0,0,.38)] sm:rounded-[28px]">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#171929] px-4 py-3 sm:px-5">
              <span className="min-w-0 truncate text-[11px] font-bold uppercase tracking-[0.16em] text-white/55 sm:text-xs">
                {game.shortTitle} · {game.title} · Round {roundIndex + 1}/{totalRounds}
              </span>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-black sm:text-xs ${
                  activeTeam === 'A'
                    ? 'bg-team-a/15 text-team-a'
                    : 'bg-team-b/15 text-team-b'
                }`}
              >
                Team {activeTeam} · {availablePoints} pts
              </span>
            </div>
            <div className="relative aspect-video bg-[#0c0d16]">
              {round.kind === 'image' ? (
                <img
                  alt={
                    revealed
                      ? `Movie answer for round ${roundIndex + 1}`
                      : `Picture puzzle for round ${roundIndex + 1}`
                  }
                  className="h-full w-full object-contain"
                  src={revealed ? round.answerImage : round.questionImage}
                />
              ) : (
                <ChoiceSlide revealed={revealed} round={round} />
              )}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 top-0 h-1 transition-colors ${
                  revealed ? 'bg-primary' : 'bg-transparent'
                }`}
              />
            </div>
          </div>

          <div
            aria-label={`Round ${roundIndex + 1} of ${totalRounds}`}
            aria-valuemax={totalRounds}
            aria-valuemin={1}
            aria-valuenow={roundIndex + 1}
            className="h-1.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${((roundIndex + 1) / totalRounds) * 100}%` }}
            />
          </div>

          <nav aria-label="Choose round" className="round-strip">
            {game.rounds.map((_, index) => (
              <Button
                aria-current={index === roundIndex ? 'step' : undefined}
                aria-label={`Round ${index + 1}${results[index] ? ', completed' : ''}`}
                className={`relative size-8 rounded-full p-0 text-xs font-black ${
                  index === roundIndex
                    ? 'bg-primary text-primary-foreground'
                    : results[index]
                      ? 'border-team-a/40 bg-team-a/10 text-team-a'
                      : 'text-muted-foreground'
                }`}
                key={index}
                onClick={() => goToRound(index)}
                size="icon"
                variant={index === roundIndex ? 'default' : 'outline'}
              >
                {results[index] ? <Check className="size-3.5" /> : index + 1}
              </Button>
            ))}
          </nav>
        </div>

        <aside className="host-panel">
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {roundResult ? 'Round complete' : revealed ? 'Score this round' : 'Current turn'}
              </p>
              {history.length > 0 && (
                <Button
                  className="text-muted-foreground"
                  onClick={undoLastResult}
                  size="sm"
                  variant="ghost"
                >
                  <Undo2 aria-hidden="true" /> Undo
                </Button>
              )}
            </div>

            <h2 className="mt-2 flex items-center gap-2 text-2xl font-black">
              <Trophy
                aria-hidden="true"
                className={activeTeam === 'A' ? 'text-team-a' : 'text-team-b'}
              />
              {roundResult
                ? roundResult.team
                  ? `Team ${roundResult.team} +${roundResult.points}`
                  : 'No points'
                : `Team ${activeTeam}`}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {roundResult
                ? 'The result is locked in. Move on when everyone is ready.'
                : passed
                  ? `The question has passed to Team ${activeTeam} for 10 points.`
                  : `Team ${starter} gets the first attempt for 20 points.`}
            </p>
          </div>

          <div className="my-1 h-px bg-white/10" />

          <div className="mt-auto space-y-3">
            {!revealed && !roundResult && (
              <>
                <Button
                  className="h-14 w-full rounded-2xl text-base font-black shadow-[0_12px_30px_rgba(255,82,112,.2)]"
                  onClick={() => setRevealed(true)}
                  size="lg"
                >
                  <Eye aria-hidden="true" /> Reveal answer
                </Button>
                {!passed && (
                  <Button
                    className="h-12 w-full rounded-2xl font-bold"
                    onClick={() => setPassed(true)}
                    size="lg"
                    variant="secondary"
                  >
                    <ArrowRightLeft aria-hidden="true" /> Pass to Team {otherTeam(starter)} · 10 pts
                  </Button>
                )}
              </>
            )}

            {revealed && !roundResult && (
              <>
                <Button
                  className={`h-14 w-full rounded-2xl text-base font-black ${
                    activeTeam === 'A'
                      ? 'bg-team-a text-[#04211c] hover:bg-team-a/85'
                      : 'bg-team-b text-[#251701] hover:bg-team-b/85'
                  }`}
                  onClick={() => recordResult(availablePoints)}
                  size="lg"
                >
                  <Check aria-hidden="true" /> Team {activeTeam} +{availablePoints}
                </Button>
                <Button
                  className="h-11 w-full rounded-2xl font-bold"
                  onClick={() => recordResult(0)}
                  size="lg"
                  variant="outline"
                >
                  <CircleX aria-hidden="true" /> No points
                </Button>
                <Button
                  className="w-full text-muted-foreground"
                  onClick={() => setRevealed(false)}
                  variant="ghost"
                >
                  Show question again
                </Button>
              </>
            )}

            {roundResult && roundIndex < totalRounds - 1 && (
              <Button
                className="h-14 w-full rounded-2xl text-base font-black"
                onClick={() => goToRound(roundIndex + 1)}
                size="lg"
              >
                Next round <ArrowRight aria-hidden="true" />
              </Button>
            )}

            {roundResult && roundIndex === totalRounds - 1 && (
              <div className="rounded-2xl border border-team-b/25 bg-team-b/10 p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-team-b">
                  {gameComplete ? 'Game complete' : 'Final round scored'}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {scores.A === scores.B
                    ? 'It’s a tie.'
                    : `Team ${scores.A > scores.B ? 'A' : 'B'} is in the lead.`}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-4">
            <span className="text-xs text-muted-foreground">
              {completedCount}/{totalRounds} scored
            </span>
            <Button onClick={resetGame} size="sm" variant="ghost">
              <RotateCcw aria-hidden="true" /> Reset game
            </Button>
          </div>
        </aside>
      </section>
    </main>
  );
}
