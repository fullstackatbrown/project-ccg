const employer = (name:string, file:string) => ({name,logo:`/assets/companies/${file}`,surface:'white',invertLogo:false,largeLogo:false,showCaption:false});
export function reviewAlumniIndustries(industries:any[]) {
 const consulting = industries.find(group=>group.layout==='consulting');
 const finance = industries.find(group=>group.layout==='finance');
 const tech = industries.find(group=>group.layout==='tech');
 const more = industries.find(group=>group.layout==='more');
 if(!consulting || !finance || !tech || !more) return industries;
 const groups = [
  {...consulting,layout:'consulting-expanded',employers:[...consulting.employers,
   {...employer('OC&C','occ.svg'),invertLogo:true},employer('Arthur D. Little','adl.jpeg'),employer('Capital One','capitalone.svg'),
   employer('Oliver Wyman','oliverwyman.svg'),employer('L.E.K. Consulting','lek.svg'),employer('Simon-Kucher','simonkucher.svg'),employer('Cornerstone Research','cornerstone.svg')]},
  {name:'Investment Banking',layout:'banking',employers:finance.employers.slice(0,9)},
  {name:'Investing & Trading',layout:'investing',employers:[...finance.employers.slice(9),
   employer('Optiver','optiver.svg'),employer('Bridgewater Associates','bridgewater.png'),employer('Pear VC','pear.png'),employer('Insight Partners','insight.svg')]},
  {...tech,layout:'tech-expanded',employers:[...tech.employers,employer('Apple','apple.svg')]},
  {...more,layout:'more-expanded',employers:[...more.employers,employer('a16z','a16z.svg')]},
 ];
 const variants:any = {
  'Boston Consulting Group': {surface:'green',logo:'/assets/companies/bcg-mark.svg'},
  'Arthur D. Little': {surface:'white',invertLogo:false},
  'a16z': {surface:'maroon',logo:'/assets/companies/a16z.svg',invertLogo:false},
  'Goldman Sachs': {surface:'white',logo:'/assets/companies/goldmansachs.svg',invertLogo:false},
  'Centerview Partners': {surface:'white',logo:'/assets/companies/centerview-supplied.png',invertLogo:false},
  'Lazard': {surface:'white',logo:'/assets/companies/lazard-supplied.png',invertLogo:false},
  'Blackstone': {surface:'white',logo:'/assets/companies/blackstone-supplied.png',invertLogo:false}, 'BlackRock': {surface:'black'},
  'Palantir': {surface:'black'}, 'DoorDash': {surface:'doordash'}, 'Square': {surface:'black'},
 };
 return groups.map(group=>({...group,employers:group.employers.map((item:any)=>({...item,...(variants[item.name]||{})}))}));
}
