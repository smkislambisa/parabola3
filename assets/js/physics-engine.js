/* Mesin fisika gerak parabola: integrasi numerik RK4, SI, drag kuadratik opsional. */
window.ParabolaPhysics = (() => {
  const rad = d => d * Math.PI / 180;
  const derivative = (s, g, k) => {
    const speed = Math.hypot(s.vx, s.vy);
    return {x:s.vx, y:s.vy, vx:-k*speed*s.vx, vy:-g-k*speed*s.vy};
  };
  function calculate({speed, angle, height=0, gravity=9.8, drag=0}) {
    const th=rad(angle), k=Math.max(0,Number(drag)||0), dt=.01;
    let s={x:0,y:height,vx:speed*Math.cos(th),vy:speed*Math.sin(th)}, t=0;
    const initialA=derivative(s,gravity,k);const samples=[{t,...s,ax:initialA.vx,ay:initialA.vy}], maxSteps=30000;
    while(t<120 && samples.length<maxSteps){
      const a=derivative(s,gravity,k), b=derivative({x:s.x+a.x*dt/2,y:s.y+a.y*dt/2,vx:s.vx+a.vx*dt/2,vy:s.vy+a.vy*dt/2},gravity,k);
      const c=derivative({x:s.x+b.x*dt/2,y:s.y+b.y*dt/2,vx:s.vx+b.vx*dt/2,vy:s.vy+b.vy*dt/2},gravity,k);
      const d=derivative({x:s.x+c.x*dt,y:s.y+c.y*dt,vx:s.vx+c.vx*dt,vy:s.vy+c.vy*dt},gravity,k);
      const old=s, next={x:s.x+dt*(a.x+2*b.x+2*c.x+d.x)/6,y:s.y+dt*(a.y+2*b.y+2*c.y+d.y)/6,vx:s.vx+dt*(a.vx+2*b.vx+2*c.vx+d.vx)/6,vy:s.vy+dt*(a.vy+2*b.vy+2*c.vy+d.vy)/6};
      t+=dt;
      if(next.y<0){const f=old.y/(old.y-next.y);s={x:old.x+(next.x-old.x)*f,y:0,vx:old.vx+(next.vx-old.vx)*f,vy:old.vy+(next.vy-old.vy)*f};t-=dt*(1-f);const aa=derivative(s,gravity,k);samples.push({t,...s,ax:aa.vx,ay:aa.vy});break;}
      s=next;const aa=derivative(s,gravity,k);samples.push({t,...s,ax:aa.vx,ay:aa.vy});
    }
    const apex=samples.reduce((p,q)=>q.y>p.y?q:p,samples[0]);
    const at=t=>{const i=Math.min(samples.length-1,Math.max(0,Math.floor(t/dt)));const a=samples[i],b=samples[Math.min(i+1,samples.length-1)],f=b.t===a.t?0:(t-a.t)/(b.t-a.t);return Object.fromEntries(['x','y','vx','vy','ax','ay'].map(k=>[k,a[k]+(b[k]-a[k])*f]));};
    return {vx:samples[0].vx,vy:samples[0].vy,flightTime:t,apexTime:apex.t,maxHeight:apex.y,range:samples.at(-1).x,landingSpeed:Math.hypot(s.vx,s.vy),samples,position:t=>{const q=at(t);return{x:q.x,y:q.y};},velocity:t=>{const q=at(t);return{x:q.vx,y:q.vy};},acceleration:t=>{const q=at(t);return{x:q.ax,y:q.ay};},at};
  }
  return {calculate};
})();
