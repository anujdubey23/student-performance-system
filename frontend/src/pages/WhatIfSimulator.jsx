import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  TrendingUp, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  AlertCircle,
  HelpCircle,
  Zap,
  Target
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { apiService } from '../services/api';

export const WhatIfSimulator = ({ student, currentPrediction, onApplySimulation }) => {
  // Baseline initial values from current student
  const baseline = {
    attendance: student?.attendance || 84.5,
    previous_percentage: student?.previous_percentage || 78.0,
    assignment_score: student?.assignment_score || 76.5,
    quiz_score: student?.quiz_score || 72.0,
    internal_marks: student?.internal_marks || 74.0,
    study_hours: student?.study_hours || 14.5,
    completed_assignments: student?.completed_assignments || 8,
    completed_quizzes: student?.completed_quizzes || 4,
    student_name: student?.student_name || 'Anuj Dubey',
    student_id: student?.student_id || 'STU1024',
    subjects: student?.subjects || {}
  };

  const [simValues, setSimValues] = useState(baseline);
  const [simPrediction, setSimPrediction] = useState(currentPrediction);
  const [appliedNotification, setAppliedNotification] = useState(false);

  // Re-run prediction whenever simulated values change
  useEffect(() => {
    let isMounted = true;
    async function runSim() {
      try {
        const res = await apiService.predictPerformance(simValues);
        if (isMounted && res?.prediction) {
          setSimPrediction(res.prediction);
        }
      } catch (err) {
        console.error('Simulation prediction error:', err);
      }
    }
    const timer = setTimeout(runSim, 100);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [simValues]);

  const handleSliderChange = (field, val) => {
    setSimValues(prev => ({
      ...prev,
      [field]: parseFloat(val)
    }));
  };

  const resetToBaseline = () => {
    setSimValues(baseline);
    setSimPrediction(currentPrediction);
  };

  const handleApply = () => {
    if (onApplySimulation) {
      onApplySimulation(simValues);
      setAppliedNotification(true);
      setTimeout(() => setAppliedNotification(false), 3500);
    }
  };

  // Helper to calculate delta string
  const getDelta = (simVal, baseVal, unit = '%') => {
    const diff = (simVal - baseVal).toFixed(1);
    if (diff > 0) return <span className="text-emerald-600 font-semibold font-mono text-xs">+{diff}{unit}</span>;
    if (diff < 0) return <span className="text-rose-600 font-semibold font-mono text-xs">{diff}{unit}</span>;
    return <span className="text-slate-400 font-mono text-xs">0{unit}</span>;
  };

  const currentCategory = currentPrediction?.predicted_category || 'Average Performance';
  const simulatedCategory = simPrediction?.predicted_category || 'Average Performance';
  const isUpgraded = currentCategory !== 'High Performance' && simulatedCategory === 'High Performance';
  const isDowngraded = currentCategory !== 'At Risk' && simulatedCategory === 'At Risk';

  // Prescriptive target calculation
  const getPrescriptiveTip = () => {
    if (simulatedCategory === 'High Performance') {
      return "Excellent! In this scenario, the combination of consistent study hours and continuous evaluations elevates you into the top tier.";
    }
    if (simulatedCategory === 'Average Performance') {
      return "To breach the 'High Performance' threshold, try pushing study hours beyond 18 hrs/week and internal exam marks above 82%.";
    }
    return "Warning: Attendance dropping below 75% or internal marks under 60% severely impacts the classification into the 'At Risk' zone.";
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-teal-600" />
              Prescriptive AI Module
            </span>
            <span className="text-xs text-slate-500 font-mono">Counterfactual Decision Analysis</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            "What-If" Performance Simulator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Adjust academic habits and assessment scores in real time to observe the Random Forest model re-predict your standing
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={resetToBaseline}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset to Baseline</span>
          </button>

          <button
            onClick={handleApply}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Apply to My Profile</span>
          </button>
        </div>
      </div>

      {appliedNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Simulation values have been saved and applied to your global dashboard!</span>
        </div>
      )}

      {/* Outcome Comparison Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Baseline Card */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Current Actual Standing (Baseline)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-800">{currentCategory}</span>
              <StatusBadge status={currentCategory} size="small" />
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Model Confidence: {currentPrediction?.confidence || 75}%
            </span>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Study: <strong>{baseline.study_hours}h/wk</strong></div>
            <div>Att: <strong>{baseline.attendance}%</strong></div>
          </div>
        </div>

        {/* Simulated Card */}
        <div className={`rounded-xl p-5 border shadow-sm flex items-center justify-between transition-colors ${
          isUpgraded 
            ? 'bg-emerald-50/80 border-emerald-300' 
            : isDowngraded 
              ? 'bg-rose-50/80 border-rose-300' 
              : 'bg-white border-teal-300'
        }`}>
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider block flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Simulated Future Standing
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">{simulatedCategory}</span>
              <StatusBadge status={simulatedCategory} size="small" />
            </div>
            <span className="text-xs text-slate-600 font-mono">
              Simulated Confidence: <strong>{simPrediction?.confidence || 75}%</strong>
            </span>
          </div>
          <div className="text-right">
            {isUpgraded && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full">
                <Award className="w-3.5 h-3.5" />
                Target Reached!
              </span>
            )}
            {isDowngraded && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-full">
                <AlertCircle className="w-3.5 h-3.5" />
                Risk Zone Alert!
              </span>
            )}
            {!isUpgraded && !isDowngraded && (
              <span className="text-xs text-slate-500 italic">Same Category Tier</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Interactive Controls & Prescriptive Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sliders Panel */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Academic Habit & Performance Sliders</h3>
              <p className="text-xs text-slate-500">Drag sliders to test counterfactual scenarios</p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Real-time inference</span>
          </div>

          {/* Slider 1: Study Hours */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-800 font-semibold">Weekly Self-Study Hours</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-900 font-bold">{simValues.study_hours} hrs/week</span>
                {getDelta(simValues.study_hours, baseline.study_hours, 'h')}
              </div>
            </div>
            <input
              type="range"
              min="2"
              max="35"
              step="0.5"
              value={simValues.study_hours}
              onChange={(e) => handleSliderChange('study_hours', e.target.value)}
              className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>2 hrs (Low)</span>
              <span>18 hrs (Target)</span>
              <span>35 hrs (Intensive)</span>
            </div>
          </div>

          {/* Slider 2: Attendance */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-800 font-semibold">Lecture Attendance (%)</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-900 font-bold">{simValues.attendance}%</span>
                {getDelta(simValues.attendance, baseline.attendance)}
              </div>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="0.5"
              value={simValues.attendance}
              onChange={(e) => handleSliderChange('attendance', e.target.value)}
              className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>50%</span>
              <span className="text-rose-500 font-medium">75% (Mandatory Cutoff)</span>
              <span>100%</span>
            </div>
          </div>

          {/* Slider 3: Internal Marks */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-800 font-semibold">Internal Examination Score (%)</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-900 font-bold">{simValues.internal_marks}%</span>
                {getDelta(simValues.internal_marks, baseline.internal_marks)}
              </div>
            </div>
            <input
              type="range"
              min="35"
              max="100"
              step="0.5"
              value={simValues.internal_marks}
              onChange={(e) => handleSliderChange('internal_marks', e.target.value)}
              className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>35%</span>
              <span>60% (Passing)</span>
              <span>100%</span>
            </div>
          </div>

          {/* Slider 4: Assignment Average */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-800 font-semibold">Assignment Average Score (%)</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-900 font-bold">{simValues.assignment_score}%</span>
                {getDelta(simValues.assignment_score, baseline.assignment_score)}
              </div>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              step="0.5"
              value={simValues.assignment_score}
              onChange={(e) => handleSliderChange('assignment_score', e.target.value)}
              className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 5: Quiz Average */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-800 font-semibold">Quiz Average Score (%)</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-900 font-bold">{simValues.quiz_score}%</span>
                {getDelta(simValues.quiz_score, baseline.quiz_score)}
              </div>
            </div>
            <input
              type="range"
              min="35"
              max="100"
              step="0.5"
              value={simValues.quiz_score}
              onChange={(e) => handleSliderChange('quiz_score', e.target.value)}
              className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* Stepper counters */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Assignments Done (out of 10)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={simValues.completed_assignments}
                  onChange={(e) => handleSliderChange('completed_assignments', e.target.value)}
                  className="w-20 px-3 py-1 text-sm border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-teal-600"
                />
                <span className="text-xs text-slate-400">Baseline: {baseline.completed_assignments}/10</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Quizzes Done (out of 5)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={simValues.completed_quizzes}
                  onChange={(e) => handleSliderChange('completed_quizzes', e.target.value)}
                  className="w-20 px-3 py-1 text-sm border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-teal-600"
                />
                <span className="text-xs text-slate-400">Baseline: {baseline.completed_quizzes}/5</span>
              </div>
            </div>
          </div>

        </div>

        {/* Live Probability Comparison & Prescriptive Insights */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Probability Comparison Panel */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Simulated Probability Distribution</h3>
            <p className="text-xs text-slate-500">Live ensemble voter proportions across classes</p>

            <div className="space-y-3.5 pt-2">
              {['High Performance', 'Average Performance', 'At Risk'].map((cat) => {
                const prob = ((simPrediction?.probabilities?.[cat] || 0) * 100).toFixed(1);
                const isSelected = simPrediction?.predicted_category === cat;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span className="flex items-center gap-1.5">
                        {cat}
                        {isSelected && (
                          <span className="text-[10px] bg-teal-100 text-teal-800 font-semibold px-1.5 rounded">
                            Target
                          </span>
                        )}
                      </span>
                      <span className="font-mono font-bold">{prob}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isSelected 
                            ? cat === 'High Performance' ? 'bg-emerald-600' : cat === 'At Risk' ? 'bg-rose-500' : 'bg-teal-600' 
                            : 'bg-slate-300'
                        }`}
                        style={{ width: `${prob}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prescriptive Advisory Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Prescriptive Action Guidance</span>
            </div>
            <h4 className="text-sm font-bold text-white">
              {isUpgraded ? 'Distinction Trajectory Achieved' : 'Roadmap to Next Tier'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {getPrescriptiveTip()}
            </p>
            <div className="pt-3 border-t border-slate-700/80 text-[11px] text-slate-400">
              💡 <strong>Interview Insight:</strong> Prescriptive analytics combines predictive ML with decision simulation to provide actionable targets rather than just static metrics.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
