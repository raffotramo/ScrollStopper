import React, { useState } from 'react';
import { Share2, Twitter, Facebook, Instagram, Copy, Check, Download, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Achievement, UserStats } from '../types';

interface SocialShareProps {
  userStats: UserStats;
  achievement?: Achievement;
  milestone?: {
    type: 'level' | 'streak' | 'days' | 'stars';
    value: number;
    title: string;
  };
}

const SocialShare: React.FC<SocialShareProps> = ({ userStats, achievement, milestone }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateShareText = () => {
    if (achievement) {
      return `🎉 Ho appena sbloccato "${achievement.name}" su ScrollStop! 
⭐ +${achievement.stars} stelle
🎯 ${achievement.description}

Sto imparando a vivere una vita digitale più consapevole. Unisciti a me! #DigitalDetox #ScrollStop #Mindfulness`;
    }

    if (milestone) {
      const milestoneTexts = {
        level: `🎉 Ho raggiunto il livello ${milestone.value} su ScrollStop! 
👑 ${milestone.title}
⭐ ${userStats.totalStars} stelle totali`,
        streak: `🔥 ${milestone.value} giorni consecutivi su ScrollStop! 
💪 La costanza paga sempre
⭐ ${userStats.totalStars} stelle totali`,
        days: `🎯 ${milestone.value} giorni completati su ScrollStop! 
📱 Verso una vita digitale più equilibrata
⭐ ${userStats.totalStars} stelle totali`,
        stars: `⭐ ${milestone.value} stelle conquistate su ScrollStop! 
🎯 Ogni piccolo passo conta
🚀 Livello ${userStats.level} raggiunto`
      };

      return `${milestoneTexts[milestone.type]}

Sto trasformando le mie abitudini digitali per vivere meglio. Unisciti a me! #DigitalDetox #ScrollStop #Mindfulness`;
    }

    return `🌟 I miei progressi su ScrollStop:
📈 Livello ${userStats.level}
⭐ ${userStats.totalStars} stelle
🎯 ${userStats.daysCompleted} giorni completati
🔥 ${userStats.currentStreak} giorni di streak

Verso un rapporto più sano con la tecnologia! #DigitalDetox #ScrollStop #Mindfulness`;
  };

  const generateShareImage = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Dimensioni ottimali per i social
    canvas.width = 1200;
    canvas.height = 630;

    // Sfondo gradiente
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#fbbf24'); // amber-400
    gradient.addColorStop(1, '#f59e0b'); // amber-500
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Testo principale
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    
    if (achievement) {
      ctx.fillText('🎉 Nuovo Achievement!', canvas.width / 2, 150);
      ctx.font = 'bold 36px Arial';
      ctx.fillText(achievement.name, canvas.width / 2, 220);
      ctx.font = '28px Arial';
      ctx.fillText(`⭐ +${achievement.stars} stelle`, canvas.width / 2, 280);
    } else if (milestone) {
      ctx.fillText(`🎯 ${milestone.title}`, canvas.width / 2, 150);
      ctx.font = 'bold 36px Arial';
      ctx.fillText(`${milestone.value}`, canvas.width / 2, 220);
    } else {
      ctx.fillText('🌟 I miei progressi', canvas.width / 2, 150);
      ctx.font = 'bold 36px Arial';
      ctx.fillText(`Livello ${userStats.level}`, canvas.width / 2, 220);
      ctx.font = '28px Arial';
      ctx.fillText(`⭐ ${userStats.totalStars} stelle`, canvas.width / 2, 280);
    }

    // Footer
    ctx.font = '24px Arial';
    ctx.fillText('ScrollStop - Verso un digitale più consapevole', canvas.width / 2, 520);

    return canvas.toDataURL('image/png');
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(generateShareText());
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnFacebook = () => {
    const text = encodeURIComponent(generateShareText());
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${text}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnInstagram = async () => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      try {
        // Su mobile, prova a aprire Instagram direttamente
        const text = encodeURIComponent(generateShareText());
        const instagramUrl = `instagram://camera?text=${text}`;
        
        // Prova prima a aprire l'app Instagram
        window.location.href = instagramUrl;
        
        // Fallback dopo un breve delay se l'app non si apre
        setTimeout(() => {
          if (navigator.share) {
            generateShareImage().then(async (imageData) => {
              if (imageData) {
                const response = await fetch(imageData);
                const blob = await response.blob();
                const file = new File([blob], 'scrollstop-progress.png', { type: 'image/png' });
                
                navigator.share({
                  title: 'I miei progressi ScrollStop',
                  text: generateShareText(),
                  files: [file]
                }).catch(() => {
                  // Se tutto fallisce, copia e scarica
                  copyToClipboard();
                  downloadImage();
                });
              }
            });
          }
        }, 2000);
        
      } catch (error) {
        // Fallback per dispositivi mobili
        copyToClipboard();
        await downloadImage();
        toast({
          title: "Contenuto preparato!",
          description: "Testo copiato e immagine scaricata per Instagram",
        });
      }
    } else {
      // Su desktop, prepara il contenuto per il download
      copyToClipboard();
      await downloadImage();
      toast({
        title: "Contenuto preparato!",
        description: "Testo copiato e immagine scaricata. Apri Instagram dal tuo telefono per condividere",
      });
    }
  };

  const shareOnTikTok = async () => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      try {
        // Su mobile, prova a aprire TikTok direttamente
        const text = encodeURIComponent(generateShareText());
        const tiktokUrl = `tiktok://share?text=${text}`;
        
        // Prova prima a aprire l'app TikTok
        window.location.href = tiktokUrl;
        
        // Fallback dopo un breve delay
        setTimeout(() => {
          if (navigator.share) {
            generateShareImage().then(async (imageData) => {
              if (imageData) {
                const response = await fetch(imageData);
                const blob = await response.blob();
                const file = new File([blob], 'scrollstop-progress.png', { type: 'image/png' });
                
                navigator.share({
                  title: 'I miei progressi ScrollStop',
                  text: generateShareText(),
                  files: [file]
                }).catch(() => {
                  copyToClipboard();
                  downloadImage();
                });
              }
            });
          }
        }, 2000);
        
      } catch (error) {
        copyToClipboard();
        await downloadImage();
        toast({
          title: "Contenuto preparato!",
          description: "Testo copiato e immagine scaricata per TikTok",
        });
      }
    } else {
      // Su desktop, prepara il contenuto
      copyToClipboard();
      await downloadImage();
      toast({
        title: "Contenuto preparato!",
        description: "Testo copiato e immagine scaricata. Apri TikTok dal tuo telefone per condividere",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Testo copiato!",
      description: "Condividi il tuo progresso ovunque vuoi",
    });
  };

  const downloadImage = async () => {
    const imageData = await generateShareImage();
    if (!imageData) return;

    const link = document.createElement('a');
    link.download = achievement 
      ? `scrollstop-achievement-${achievement.id}.png`
      : 'scrollstop-progress.png';
    link.href = imageData;
    link.click();

    toast({
      title: "Immagine scaricata!",
      description: "Condividila sui tuoi social preferiti",
    });
  };

  const shareTitle = achievement 
    ? `Condividi "${achievement.name}"`
    : milestone 
    ? `Condividi ${milestone.title}`
    : 'Condividi i tuoi progressi';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Condividi
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            {shareTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Anteprima del contenuto */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Anteprima</CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-gray-50 rounded">
              <p className="text-sm whitespace-pre-line">
                {generateShareText()}
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Pulsanti di condivisione */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                onClick={shareOnTwitter}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                size="sm"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              
              <Button
                onClick={shareOnFacebook}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={shareOnInstagram}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                size="sm"
              >
                <Instagram className="w-4 h-4 mr-2" />
                Instagram
              </Button>
              
              <Button
                onClick={shareOnTikTok}
                className="flex-1 bg-black hover:bg-gray-800 text-white"
                size="sm"
              >
                <Music className="w-4 h-4 mr-2" />
                TikTok
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                {copied ? (
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? 'Copiato!' : 'Copia testo'}
              </Button>
              
              <Button
                onClick={downloadImage}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Scarica immagine
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center space-y-1">
            <div>📱 Su mobile: Instagram e TikTok si aprono direttamente</div>
            <div>💻 Su desktop: scarica immagine e copia testo per condividere</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialShare;