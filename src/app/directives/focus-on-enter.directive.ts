import { Directive, Input, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
type IKNOWISNUMBER = any;
type IKNOWISSTRING = any;

@Directive({
    selector: '[appFocusOnEnter]',
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})
export class FocusOnEnterDirective {

    private _index: number;
    get index(): IKNOWISNUMBER {
        return this._index;
    }
    @Input('tabIndex')
    set index(i: IKNOWISSTRING) {
        this._index = parseInt(i);
    }
    @HostListener('keydown', ['$event'])
    onInput(e: any) {
        if (e.which === 13) {
            this.commonService.selectedInput.next(this.index + 1)
            e.preventDefault();
        }
    }
    constructor(private el: ElementRef, private commonService: CommonService) {
    }

    ngOnInit() {
        this.commonService.selectedInput
            .subscribe((i) => {
                if (i === this.index) {
                    if (this.el.nativeElement.disabled) {
                        this.commonService.selectedInput.next(this.index + 1)
                    }
                    this.el.nativeElement.focus();
                }
            });
    }

}


