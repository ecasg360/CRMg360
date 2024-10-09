import { async, TestBed } from '@angular/core/testing';
import { AddWorksmanageComponent } from './add-worksmanage.component';
describe('AddWorksmanageComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [AddWorksmanageComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(AddWorksmanageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=add-worksmanage.component.spec.js.map