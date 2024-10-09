import { async, TestBed } from '@angular/core/testing';
import { SelectionContractTermsComponent } from './selection-contract-terms.component';
describe('SelectionContractTermsComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [SelectionContractTermsComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(SelectionContractTermsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=selection-contract-terms.component.spec.js.map