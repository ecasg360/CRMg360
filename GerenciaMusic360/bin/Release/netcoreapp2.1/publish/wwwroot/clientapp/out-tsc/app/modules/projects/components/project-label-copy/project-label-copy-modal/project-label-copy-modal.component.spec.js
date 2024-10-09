import { async, TestBed } from '@angular/core/testing';
import { ProjectLabelCopyModalComponent } from './project-label-copy-modal.component';
describe('ProjectLabelCopyModalComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [ProjectLabelCopyModalComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(ProjectLabelCopyModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=project-label-copy-modal.component.spec.js.map