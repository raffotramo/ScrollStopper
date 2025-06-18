import React, { useState } from 'react';
import { Star, Trophy, Lock, Sparkles, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Achievement } from '../types';
import { getLevelTitle } from '../lib/achievements';
import SocialShare from './SocialShare';

interface AchievementSystemProps {
  userStats: {
    totalStars: number;
    level: number;
    pointsToNextLevel: number;
    achievements: Achievement[];
  };
  allAchievements: Achievement[];
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({ 
  userStats, 
  allAchievements 
}) => {
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const levelProgress = userStats.pointsToNextLevel > 0 
    ? ((userStats.totalStars) / (userStats.totalStars + userStats.pointsToNextLevel)) * 100
    : 100;

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShowAchievementModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header con livello e stelle */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="w-6 h-6 text-amber-600" />
            <CardTitle className="text-xl text-amber-800">
              Livello {userStats.level} - {getLevelTitle(userStats.level)}
            </CardTitle>
          </div>
          
          <div className="flex items-center justify-center gap-1 mb-3">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="text-2xl font-bold text-amber-700">{userStats.totalStars}</span>
            <span className="text-amber-600">stelle totali</span>
          </div>

          {/* Barra di progresso livello */}
          <div className="w-full bg-amber-100 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-amber-400 to-amber-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          
          {userStats.pointsToNextLevel > 0 ? (
            <p className="text-sm text-amber-600">
              {userStats.pointsToNextLevel} stelle al prossimo livello
            </p>
          ) : (
            <p className="text-sm text-amber-600 font-semibold">
              Livello massimo raggiunto! 🎉
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Griglia achievement */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allAchievements.map(achievement => (
          <Card 
            key={achievement.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              achievement.unlocked 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
            onClick={() => handleAchievementClick(achievement)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold text-sm ${
                      achievement.unlocked ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {achievement.name}
                    </h3>
                    {achievement.unlocked && (
                      <Sparkles className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  
                  <p className={`text-xs mb-2 ${
                    achievement.unlocked ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className={`w-3 h-3 ${
                        achievement.unlocked ? 'text-amber-500 fill-amber-500' : 'text-gray-400'
                      }`} />
                      <span className={`text-xs font-medium ${
                        achievement.unlocked ? 'text-amber-700' : 'text-gray-500'
                      }`}>
                        {achievement.stars}
                      </span>
                    </div>
                    
                    <Badge 
                      variant={achievement.unlocked ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {achievement.unlocked ? 'Sbloccato' : 'Bloccato'}
                    </Badge>
                  </div>
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-green-600 mt-1">
                      Sbloccato: {new Date(achievement.unlockedAt).toLocaleDateString('it-IT')}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistiche totali */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              I tuoi progressi
            </CardTitle>
            <SocialShare 
              userStats={{
                totalStars: userStats.totalStars,
                level: userStats.level,
                pointsToNextLevel: userStats.pointsToNextLevel,
                daysCompleted: userStats.achievements.filter(a => a.unlocked).length,
                currentStreak: 0,
                totalReflections: 0,
                totalTimeRecovered: 0,
                achievements: userStats.achievements
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {userStats.achievements.filter(a => a.unlocked).length}
              </div>
              <div className="text-sm text-gray-600">Achievement sbloccati</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">
                {userStats.totalStars}
              </div>
              <div className="text-sm text-gray-600">Stelle guadagnate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal dettagli achievement */}
      <Dialog open={showAchievementModal} onOpenChange={setShowAchievementModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAchievement && (
                <>
                  <span className="text-2xl">{selectedAchievement.icon}</span>
                  {selectedAchievement.name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedAchievement && (
            <div className="space-y-4">
              <p className="text-gray-600">{selectedAchievement.description}</p>
              
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <span className="text-sm font-medium">Ricompensa:</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-amber-700">{selectedAchievement.stars} stelle</span>
                </div>
              </div>
              
              <Badge 
                variant={selectedAchievement.unlocked ? "default" : "secondary"}
                className="w-full justify-center py-2"
              >
                {selectedAchievement.unlocked ? '✅ Sbloccato' : '🔒 Da sbloccare'}
              </Badge>
              
              {selectedAchievement.unlocked && selectedAchievement.unlockedAt && (
                <p className="text-center text-sm text-green-600">
                  Sbloccato il {new Date(selectedAchievement.unlockedAt).toLocaleDateString('it-IT')}
                </p>
              )}

              {selectedAchievement.unlocked && (
                <div className="flex justify-center pt-2">
                  <SocialShare 
                    userStats={{
                      totalStars: userStats.totalStars,
                      level: userStats.level,
                      pointsToNextLevel: userStats.pointsToNextLevel,
                      daysCompleted: userStats.achievements.filter(a => a.unlocked).length,
                      currentStreak: 0,
                      totalReflections: 0,
                      totalTimeRecovered: 0,
                      achievements: userStats.achievements
                    }}
                    achievement={selectedAchievement}
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AchievementSystem;