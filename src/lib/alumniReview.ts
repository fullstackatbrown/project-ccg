const employer = (name:string, file:string) => ({name,logo:`/assets/companies/${file}`,surface:'white',invertLogo:false,largeLogo:false,showCaption:false});
export function reviewAlumniIndustries(industries:any[]) {
 const consulting = industries.find(group=>group.layout==='consulting');
 const finance = industries.find(group=>group.layout==='finance');
 const tech = industries.find(group=>group.layout==='tech');
 const more = industries.find(group=>group.layout==='more');
 if(!consulting || !finance || !tech || !more) return industries;
 return [
  {...consulting,layout:'consulting-expanded',employers:[...consulting.employers,
   {...employer('OC&C','occ.svg'),invertLogo:true},employer('Arthur D. Little','adl.jpeg'),employer('Capital One','capitalone.svg'),
   employer('Oliver Wyman','oliverwyman.svg'),employer('L.E.K. Consulting','lek.svg'),employer('Simon-Kucher','simonkucher.svg'),employer('Cornerstone Research','cornerstone.svg')]},
  {name:'Investment Banking',layout:'banking',employers:finance.employers.slice(0,9)},
  {name:'Investing & Trading',layout:'investing',employers:[...finance.employers.slice(9),
   employer('Optiver','optiver.svg'),employer('Bridgewater Associates','bridgewater.png'),employer('Pear VC','pear.png'),employer('Insight Partners','insight.svg')]},
  {...tech,layout:'tech-expanded',employers:[...tech.employers,employer('Apple','apple.svg')]},
  {...more,layout:'more-expanded',employers:[...more.employers,employer('a16z','a16z.svg')]},
 ];
}
