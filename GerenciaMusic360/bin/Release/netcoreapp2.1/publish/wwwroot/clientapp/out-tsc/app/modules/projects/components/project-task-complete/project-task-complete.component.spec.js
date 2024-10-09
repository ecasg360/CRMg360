import { async, TestBed } from '@angular/core/testing';
import { ProjectTaskCompleteComponent } from './project-task-complete.component';
describe('ProjectTaskCompleteComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [ProjectTaskCompleteComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(ProjectTaskCompleteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=project-task-complete.component.spec.js.map