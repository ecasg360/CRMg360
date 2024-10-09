import { async, TestBed } from '@angular/core/testing';
import { MarketingPlanCompleteComponent } from './marketing-plan-complete.component';
describe('MarketingPlanCompleteComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [MarketingPlanCompleteComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(MarketingPlanCompleteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=marketing-plan-complete.component.spec.js.map