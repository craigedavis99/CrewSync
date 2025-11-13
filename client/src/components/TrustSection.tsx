export function TrustSection() {
  return (
    <section className="py-16 px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm font-medium text-muted-foreground mb-8" data-testid="text-trust-heading">
          Trusted by service professionals who want to grow their business
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
          <div className="text-2xl font-bold text-foreground">PlumbPro</div>
          <div className="text-2xl font-bold text-foreground">CoolAir HVAC</div>
          <div className="text-2xl font-bold text-foreground">DoorMasters</div>
          <div className="text-2xl font-bold text-foreground">ClearView</div>
          <div className="text-2xl font-bold text-foreground">FixRight</div>
        </div>
      </div>
    </section>
  );
}
