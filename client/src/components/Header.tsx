import scrollStopLogo from "@assets/Progetto senza titolo (4).png";

const Header = () => {
  return (
    <div className="flex justify-center py-4 bg-background">
      <img 
        src={scrollStopLogo} 
        alt="ScrollStop - Riprenditi il tuo tempo, riconnettiti con la vita" 
        className="h-16 w-auto brightness-0"
        style={{ filter: 'brightness(0)' }}
      />
    </div>
  );
};

export default Header;