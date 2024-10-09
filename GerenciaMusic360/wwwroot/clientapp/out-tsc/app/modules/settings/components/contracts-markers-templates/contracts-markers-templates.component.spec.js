import { async, TestBed } from '@angular/core/testing';
import { ContractsMarkersTemplatesComponent } from './contracts-markers-templates.component';
describe('ContractsMarkersTemplatesComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [ContractsMarkersTemplatesComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(ContractsMarkersTemplatesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=contracts-markers-templates.component.spec.js.map