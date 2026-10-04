import React, { useState } from 'react';
import { Navigation, Bike, Footprints, AlertCircle, Plus, Check } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useFocusStore } from '../../store/useFocusStore';

export const CampusTransitPlanner: React.FC = () => {
  const { campusRoutes, addTask } = useFocusStore();
  const [selectedRouteId, setSelectedRouteId] = useState(campusRoutes[0]?.id || 'cr-1');
  const [transitMode, setTransitMode] = useState<'walk' | 'bike'>('walk');
  const [addedNotice, setAddedNotice] = useState(false);

  const selectedRoute = campusRoutes.find((r) => r.id === selectedRouteId) || campusRoutes[0];

  const handleAddBuffer = () => {
    addTask({
      courseId: 'cs106b',
      title: `Campus Walk: ${selectedRoute.from} → ${selectedRoute.to}`,
      description: `${transitMode === 'walk' ? 'Walking' : 'Biking'} buffer between classes. ${selectedRoute.bufferRecommendation}`,
      cognitiveLoad: 'admin',
      dueDate: 'Today at 11:20 AM',
      estimatedMinutes: transitMode === 'walk' ? selectedRoute.walkMinutes : selectedRoute.bikeMinutes,
      completed: false
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <Card className="p-5 bg-white dark:bg-[#14151a] border border-[#e8e5df] dark:border-[#232630] shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#f4f1eb] dark:bg-[#1c1e26] text-[#1c1d21] dark:text-[#f0eff4] flex items-center justify-center">
            <Navigation className="w-4 h-4 text-[#64676e] dark:text-[#9ba0a9]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4]">
              Campus Walk & Transit Times
            </h3>
            <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
              Check travel time between campus buildings and add buffer blocks to your day.
            </p>
          </div>
        </div>

        {/* Walk vs Bike Toggle */}
        <div className="flex items-center bg-[#f4f1eb] dark:bg-[#1c1e26] p-0.5 rounded-lg border border-[#e8e5df] dark:border-[#292c38]">
          <button
            onClick={() => setTransitMode('walk')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
              transitMode === 'walk'
                ? 'bg-white dark:bg-[#252834] text-[#1c1d21] dark:text-[#f0eff4] shadow-xs'
                : 'text-[#64676e] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-white'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>Walk</span>
          </button>

          <button
            onClick={() => setTransitMode('bike')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
              transitMode === 'bike'
                ? 'bg-white dark:bg-[#252834] text-[#1c1d21] dark:text-[#f0eff4] shadow-xs'
                : 'text-[#64676e] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Bike</span>
          </button>
        </div>
      </div>

      {/* Route Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {campusRoutes.map((route) => {
          const isSelected = route.id === selectedRouteId;
          const duration = transitMode === 'walk' ? route.walkMinutes : route.bikeMinutes;

          return (
            <button
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#f4f1eb]/80 dark:bg-[#1e2028] border-[#1c1d21] dark:border-[#f1f2f5] text-[#1c1d21] dark:text-[#f0eff4] shadow-xs'
                  : 'bg-white dark:bg-[#16171d] border-[#e8e5df] dark:border-[#232630] text-[#64676e] dark:text-[#9ba0a9] hover:border-[#d5d0c7] dark:hover:border-[#333744]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-[#787b84] dark:text-[#8d929e] mb-1">
                <span>{route.distanceMiles} miles</span>
                <span className="font-semibold text-[#1c1d21] dark:text-[#f0eff4]">{duration} min</span>
              </div>
              <div className="text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] truncate">{route.from}</div>
              <div className="text-[11px] text-[#64676e] dark:text-[#9ba0a9] truncate">→ {route.to}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Route Advisory */}
      <div className="p-3.5 rounded-xl bg-[#fcfbf9] dark:bg-[#181a22] border border-[#e8e5df] dark:border-[#232630] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#b45309] dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#1c1d21] dark:text-[#f0eff4]">
              Route advisory: {selectedRoute.quadCrowdLevel} Crowd Level
            </span>
            <p className="text-[#64676e] dark:text-[#9ba0a9] text-[11.5px] mt-0.5">
              {selectedRoute.bufferRecommendation}
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleAddBuffer}
          className="shrink-0 text-xs font-medium"
          icon={addedNotice ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
        >
          {addedNotice ? 'Buffer Added' : 'Add Buffer to Today'}
        </Button>
      </div>
    </Card>
  );
};
