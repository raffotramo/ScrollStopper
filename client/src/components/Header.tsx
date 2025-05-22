import scrollStopLogo from "@assets/Progetto senza titolo (4).png";

const Header = () => {
  return (
    <div className="flex justify-center py-6 bg-background">
      <img 
        src={scrollStopLogo} 
        alt="ScrollStop - Riprenditi il tuo tempo, riconnettiti con la vita" 
        className="h-16 w-auto"
      />
    </div>
  );
};

export default Header;