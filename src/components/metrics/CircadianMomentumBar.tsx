import React from 'react';
import { Sun, Moon, Zap, Clock } from 'lucide-react';
import { Card } from '../common/Card';

interface CircadianMomentumBarProps {
  chronotype: 'lark' | 'afternoon' | 'owl';
  peakStart: string;
  peakEnd: string;
}

export const CircadianMomentumBar: React.FC<CircadianMomentumBarProps> = ({
  chronotype,
  peakStart,
  peakEnd
}) => {
  const currentHourPercent = 46;

  return (
    <Card className="p-4 bg-white border border-[#e8e5df] shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#fffbeb] border border-[#fde68a] flex items-center justify-center text-amber-600">
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1c1d21]">
                Daily Alertness Window
              </span>
              <span className="text-[10px] bg-[#f4f1eb] text-[#64676e] px-2 py-0.5 rounded-full border border-[#e8e5df]">
                Morning Focus ({peakStart} – {peakEnd})
              </span>
            </div>
            <p className="text-xs text-[#64676e] mt-0.5">
              Current window: <span className="font-semibold text-[#1c1d21]">Peak Focus (88% alertness)</span>. Good time for problem sets & coding.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto text-xs text-[#64676e]">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>30m left in peak focus</span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="relative mt-2">
        <div className="h-3 w-full bg-[#f4f1eb] rounded-full overflow-hidden p-0.5 flex border border-[#e8e5df]">
          <div className="w-[30%] h-full bg-[#fde68a] rounded-l-full relative" title="Morning Peak">
            <span className="sr-only">Morning Peak</span>
          </div>

          <div className="w-[20%] h-full bg-[#eeeae3] relative" title="Break / Lunch">
            <span className="sr-only">Break</span>
          </div>

          <div className="w-[30%] h-full bg-[#cbd5e1] relative" title="Afternoon Study">
            <span className="sr-only">Afternoon Study</span>
          </div>

          <div className="w-[20%] h-full bg-[#e2ded6] rounded-r-full relative" title="Wind Down">
            <span className="sr-only">Wind Down</span>
          </div>
        </div>

        {/* Live Cursor Indicator */}
        <div
          className="absolute -top-1 bottom-0 flex flex-col items-center pointer-events-none transition-all duration-500"
          style={{ left: `${currentHourPercent}%` }}
        >
          <div className="w-2.5 h-5 bg-[#1c1d21] rounded-sm shadow-xs -mt-1" />
          <div className="text-[10px] font-mono text-white font-medium bg-[#1c1d21] px-1 rounded -mt-7 shadow-xs">
            NOW (11:15)
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#787b84] mt-3 pt-2 border-t border-[#f0ede6]">
        <span className="flex items-center gap-1.5 text-[#1c1d21]">
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          08:00 AM
        </span>
        <span>12:00 PM</span>
        <span>04:00 PM</span>
        <span className="flex items-center gap-1.5">
          <Moon className="w-3.5 h-3.5 text-slate-500" />
          10:00 PM
        </span>
      </div>
    </Card>
  );
};
