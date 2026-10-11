import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ChevronLeft } from 'lucide-react-native';

import { Chip } from '../components/Chip';
import { IconButton } from '../components/IconButton';
import { ImportancePicker } from '../components/ImportancePicker';
import { OptionCard } from '../components/OptionCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressBar } from '../components/ProgressBar';
import { ScaleAnswer } from '../components/ScaleAnswer';
import { TextAnswer } from '../components/TextAnswer';
import { Wordmark } from '../components/Wordmark';
import { needsImportance, OTHER, questions, type Question } from '../data/questions';
import { isAnswered, useAppState } from '../data/store';
import { colors, fonts, sizes } from '../theme';

// Long multi-select lists (e.g. heights) render as a compact grid instead of full-width cards.
const GRID_THRESHOLD = 8;

function chunk<T>(items: T[], size: number) {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

export default function QuizScreen() {
  const [index, setIndex] = useState(0);
  const { answers, otherText, setAnswer, setOtherText, importance, setImportance } = useAppState();

  const q = questions[index];
  const answer = answers[q.id];
  const other = otherText[q.id] ?? '';
  const answered = isAnswered(q, answer, other);
  const asksImportance = answered && needsImportance(q, answer);
  const complete = answered && (!asksImportance || importance[q.id] !== undefined);
  const isLast = index === questions.length - 1;

  const next = () => {
    if (!complete) return;
    if (isLast) router.push('/picks');
    else setIndex(index + 1);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <View style={styles.topRow}>
            <Wordmark />
            <Text style={styles.counter}>
              {index + 1} of {questions.length}
            </Text>
          </View>
          <ProgressBar total={questions.length} current={index} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View key={q.id} entering={FadeIn.duration(260)} style={styles.question}>
            <View style={styles.prompt}>
              <Chip label={q.section} />
              <Text style={styles.heading} accessibilityRole="header">
                {q.prompt}
              </Text>
              {q.kind === 'multi' && q.hint ? <Text style={styles.hint}>{q.hint}</Text> : null}
            </View>

            <AnswerInput
              q={q}
              answer={answer}
              other={other}
              onAnswer={(v) => setAnswer(q.id, v)}
              onOther={(v) => setOtherText(q.id, v)}
              onSubmit={next}
            />

            {asksImportance && (
              <ImportancePicker value={importance[q.id]} onChange={(v) => setImportance(q.id, v)} />
            )}
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <IconButton
            icon={<ChevronLeft size={22} color={colors.text} strokeWidth={1.75} />}
            accessibilityLabel="Previous question"
            disabled={index === 0}
            onPress={() => setIndex(Math.max(0, index - 1))}
          />
          <PrimaryButton label={isLast ? 'See my matches' : 'Next'} disabled={!complete} onPress={next} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type AnswerInputProps = {
  q: Question;
  answer: string | string[] | number | undefined;
  other: string;
  onAnswer: (v: string | string[] | number) => void;
  onOther: (v: string) => void;
  onSubmit: () => void;
};

function AnswerInput({ q, answer, other, onAnswer, onOther, onSubmit }: AnswerInputProps) {
  switch (q.kind) {
    case 'text':
      return (
        <TextAnswer
          value={typeof answer === 'string' ? answer : ''}
          onChangeText={onAnswer}
          accessibilityLabel={q.prompt}
          placeholder={q.placeholder}
          multiline={q.multiline}
          keyboardType={q.keyboard}
          onSubmitEditing={q.multiline ? undefined : onSubmit}
        />
      );

    case 'single': {
      const options = q.allowOther ? [...q.options, OTHER] : q.options;
      return (
        <View style={styles.options} accessibilityRole="radiogroup">
          {options.map((opt) => (
            <OptionCard key={opt} label={opt} selected={answer === opt} onPress={() => onAnswer(opt)} />
          ))}
          {answer === OTHER && (
            <TextAnswer
              value={other}
              onChangeText={onOther}
              accessibilityLabel={`${q.prompt} Other, please specify`}
              placeholder="Please specify"
              autoFocus
            />
          )}
        </View>
      );
    }

    case 'multi': {
      const selected = Array.isArray(answer) ? answer : [];
      const toggle = (opt: string) => {
        if (selected.includes(opt)) return onAnswer(selected.filter((o) => o !== opt));
        // An exclusive option ("None of these") can't be combined with the others.
        if (opt === q.exclusive) return onAnswer([opt]);
        onAnswer([...selected.filter((o) => o !== q.exclusive), opt]);
      };

      if (q.options.length > GRID_THRESHOLD) {
        const columns = q.options.length > 12 ? 3 : 2;
        return (
          <View style={styles.options}>
            {chunk(q.options, columns).map((row, r) => (
              <View key={r} style={styles.gridRow}>
                {row.map((opt) => (
                  <OptionCard
                    key={opt}
                    label={opt}
                    indicator="none"
                    compact
                    selected={selected.includes(opt)}
                    onPress={() => toggle(opt)}
                  />
                ))}
                {row.length < columns &&
                  Array.from({ length: columns - row.length }, (_, i) => <View key={`pad${i}`} style={styles.flex} />)}
              </View>
            ))}
          </View>
        );
      }
      return (
        <View style={styles.options}>
          {q.options.map((opt) => (
            <OptionCard
              key={opt}
              label={opt}
              indicator="checkbox"
              selected={selected.includes(opt)}
              onPress={() => toggle(opt)}
            />
          ))}
        </View>
      );
    }

    case 'scale':
      return (
        <ScaleAnswer
          value={typeof answer === 'number' ? answer : undefined}
          onChange={onAnswer}
          minLabel={q.minLabel}
          maxLabel={q.maxLabel}
        />
      );
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: { paddingHorizontal: sizes.gutter, paddingTop: 12, paddingBottom: 8, gap: 18 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  counter: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
  body: { paddingHorizontal: sizes.gutter, paddingTop: 28, paddingBottom: 16 },
  question: { gap: 28 },
  prompt: { gap: 12 },
  heading: { fontFamily: fonts.heading, fontSize: 30, lineHeight: 34, letterSpacing: -0.6, color: colors.text },
  hint: { fontFamily: fonts.body, fontSize: 15, color: colors.muted, marginTop: -4 },
  options: { gap: 10 },
  gridRow: { flexDirection: 'row', gap: 10 },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: sizes.gutter,
    paddingTop: 16,
    paddingBottom: 12,
  },
});
