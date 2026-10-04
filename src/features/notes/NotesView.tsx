import React, { useState } from 'react';
import {
  Plus,
  Mic,
  Square,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFocusStore } from '../../store/useFocusStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const NotesView: React.FC = () => {
  const {
    notes,
    addNote,
    convertNoteToTask,
    courses,
    setView,
    isRecordingLecture,
    recordedLectureSnippet,
    startRecordingLecture,
    stopRecordingLecture,
    synthesizeLectureIntoActionItems
  } = useFocusStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || 'cs106b');
  const [tagInput, setTagInput] = useState('Lecture, Review');
  const [convertedNotice, setConvertedNotice] = useState<string | null>(null);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addNote({
      title: title.trim(),
      content: content.trim(),
      courseId,
      tags: tagInput.split(',').map((t) => t.trim()).filter(Boolean),
      hasAudioTranscription: false
    });

    setTitle('');
    setContent('');
  };

  const handleConvert = (noteId: string) => {
    convertNoteToTask(noteId);
    setConvertedNotice(noteId);
    setTimeout(() => setConvertedNotice(null), 3500);
  };

  const handleSynthesizeAudio = () => {
    synthesizeLectureIntoActionItems();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1d21] dark:text-[#f0eff4] tracking-tight">
            Study Notes
          </h1>
          <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-1">
            Capture key lecture takeaways, formulas, and code notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isRecordingLecture ? (
            <Button
              variant="danger"
              size="sm"
              onClick={stopRecordingLecture}
              icon={<Square className="w-3.5 h-3.5 fill-white" />}
              className="text-xs font-medium"
            >
              Stop Recording
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={startRecordingLecture}
              icon={<Mic className="w-3.5 h-3.5 text-[#64676e] dark:text-[#9ba0a9]" />}
              className="text-xs font-medium"
            >
              Record Voice Note
            </Button>
          )}
        </div>
      </div>

      {/* Audio Recording Banner */}
      {isRecordingLecture && (
        <Card className="p-4 bg-[#f8f6f2] dark:bg-[#181920] border border-[#e8e5df] dark:border-[#262834] animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-end gap-1 h-5">
                <span className="w-1 bg-[#1c1d21] dark:bg-[#f0eff4] rounded-full animate-equalizer-1" />
                <span className="w-1 bg-[#1c1d21] dark:bg-[#f0eff4] rounded-full animate-equalizer-2" />
                <span className="w-1 bg-[#1c1d21] dark:bg-[#f0eff4] rounded-full animate-equalizer-3" />
                <span className="w-1 bg-[#1c1d21] dark:bg-[#f0eff4] rounded-full animate-equalizer-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787b84] dark:text-[#8d929e]">
                  Voice Recording Active
                </span>
                <p className="text-xs text-[#1c1d21] dark:text-[#f0eff4] mt-0.5">
                  {recordedLectureSnippet}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSynthesizeAudio}
              icon={<Sparkles className="w-3.5 h-3.5" />}
              className="text-xs font-medium shrink-0"
            >
              Save as Note
            </Button>
          </div>
        </Card>
      )}

      {convertedNotice && (
        <div className="p-3.5 rounded-xl bg-[#f0fdf4] dark:bg-[#052e16]/30 border border-[#bbf7d0] dark:border-[#166534] text-[#15803d] dark:text-[#4ade80] text-xs font-medium flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#15803d] dark:text-[#4ade80]" />
            <span>Note converted to a new task!</span>
          </div>
          <button
            onClick={() => setView('tasks')}
            className="underline font-semibold hover:text-[#166534] dark:hover:text-[#86efac] cursor-pointer"
          >
            View in Tasks →
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Note Composer (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="p-5 bg-white dark:bg-[#14151a] border border-[#e8e5df] dark:border-[#232630] shadow-xs">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[#1c1d21] dark:text-[#f0eff4]">New Note</h3>
              <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">Write down concepts, questions, or code</p>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-[#64676e] dark:text-[#9ba0a9] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Heapsort worst case complexity breakdown"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-[#e8e5df] dark:border-[#2a2d39] bg-white dark:bg-[#181920] text-[#1c1d21] dark:text-[#f0eff4] rounded-lg focus:outline-none focus:border-[#1c1d21] dark:focus:border-[#6366f1] font-normal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#64676e] dark:text-[#9ba0a9] mb-1">
                    Course
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-[#e8e5df] dark:border-[#2a2d39] rounded-lg bg-white dark:bg-[#181920] text-[#1c1d21] dark:text-[#f0eff4] font-normal"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#64676e] dark:text-[#9ba0a9] mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-[#e8e5df] dark:border-[#2a2d39] bg-white dark:bg-[#181920] text-[#1c1d21] dark:text-[#f0eff4] rounded-lg focus:outline-none focus:border-[#1c1d21] dark:focus:border-[#6366f1] font-normal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#64676e] dark:text-[#9ba0a9] mb-1">
                  Content
                </label>
                <textarea
                  rows={8}
                  placeholder="Type notes, formulas, or copy-paste code snippets..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-[#e8e5df] dark:border-[#2a2d39] bg-white dark:bg-[#181920] text-[#1c1d21] dark:text-[#f0eff4] rounded-lg focus:outline-none focus:border-[#1c1d21] dark:focus:border-[#6366f1] font-mono leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#f0ede6] dark:border-[#232630]">
                <Button type="submit" variant="primary" size="sm">
                  Save Note
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Captured Notes Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {notes.map((note) => {
            const course = courses.find((c) => c.id === note.courseId);

            return (
              <Card key={note.id} className="p-5 bg-white dark:bg-[#14151a] border border-[#e8e5df] dark:border-[#232630] shadow-xs">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-medium text-[#1c1d21] dark:text-[#f0eff4] bg-[#f4f1eb] dark:bg-[#1f212a] px-2 py-0.5 rounded border border-[#e8e5df] dark:border-[#2a2d39]">
                        {course?.code}
                      </span>
                      <span className="text-xs text-[#787b84] dark:text-[#8d929e]">• {note.timestamp}</span>
                      {note.hasAudioTranscription && (
                        <span className="text-[10px] font-medium text-[#4b4e55] dark:text-[#a0a4b0] bg-[#f4f1eb] dark:bg-[#1f212a] px-2 py-0.2 rounded border border-[#e8e5df] dark:border-[#2a2d39]">
                          Voice Note
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-[#1c1d21] dark:text-[#f0eff4] mt-1">{note.title}</h3>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConvert(note.id)}
                    className="text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4]"
                  >
                    Convert to Task →
                  </Button>
                </div>

                {/* Content preview */}
                <div className="bg-[#f8f6f2] dark:bg-[#0e0f13] p-3.5 rounded-xl border border-[#e8e5df] dark:border-[#232630] my-3">
                  <pre className="text-xs text-[#2c2d33] dark:text-[#d1d5db] whitespace-pre-wrap font-mono leading-relaxed">
                    {note.content}
                  </pre>
                </div>

                {/* Tags */}
                <div className="flex items-center justify-between text-xs text-[#787b84] dark:text-[#8d929e] pt-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10.5px] bg-[#f4f1eb] dark:bg-[#1c1e26] text-[#64676e] dark:text-[#9ba0a9] px-2 py-0.5 rounded-md font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] text-[#9da0a6] dark:text-[#6b7280]">Saved locally</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
