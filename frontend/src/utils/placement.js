export const placementLabels = {front:'Solo frente',back:'Solo espalda',both:'Frente + espalda','front-mini':'Frente principal + mini en espalda','back-mini':'Espalda principal + mini en pecho'};
export const placementLabel = value => placementLabels[value] || placementLabels.front;
export const isDualPlacement = value => ['both','front-mini','back-mini'].includes(value);
export const isMiniSide = (placement,side) => placement === (side === 'front' ? 'back-mini' : 'front-mini');
export const miniStyle = side => ({left:side === 'front'?'59%':'50%',top:'30%',width:'11%',height:'14%'});
