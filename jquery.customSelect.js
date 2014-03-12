/*!
 * jquery.customSelect() - v0.4.1
 * http://adam.co/lab/jquery/customselect/
 * 2013-05-13
 *
 * Copyright 2013 Adam Coulombe
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 * @license http://www.gnu.org/licenses/gpl.html GPL2 License 
 */

(function ($) {
    'use strict';

    $.fn.extend({
        customSelect: function (options) {
            // filter out <= IE6
            if (typeof document.body.style.maxHeight === 'undefined') {
                return this;
            }
            var defaults = {
                    customClass: 'custom-select',
                    mapClass:    true,
                    mapStyle:    true
            },
            options = $.extend(defaults, options),
            prefix = options.customClass,
            changed = function ($select,customSelectSpan) {
                var currentSelected = $select.find(':selected'),
                customSelectSpanInner = customSelectSpan.children(':first'),
                html = currentSelected.html() || '&nbsp;';

                customSelectSpanInner.html(html);
                
                if (currentSelected.attr('disabled')) {
                    customSelectSpan.addClass(getClass('disabled-option'));
                } else {
                    customSelectSpan.removeClass(getClass('disabled-option'));
                }
                
                setTimeout(function () {
                    customSelectSpan.removeClass(getClass('open'));
                    $(document).off('mouseup.customSelect');                  
                }, 60);
            },
            getClass = function(suffix){
                return prefix + (prefix ? '-': '') + suffix;
            };

            return this.each(function () {
                var $select = $(this),
                    customSelectInnerSpan = $('<span />').addClass(getClass('inner')),
                    customSelectSpan = $('<span />');

                $select.after(customSelectSpan.append(customSelectInnerSpan));
                
                customSelectSpan.addClass(prefix);

                if (options.mapClass) {
                    customSelectSpan.addClass($select.attr('class'));
                }
                if (options.mapStyle) {
                    customSelectSpan.attr('style', $select.attr('style'));
                }

                $select
                    .addClass('has-custom-select')
                    .on('render.customSelect', function () {
                        changed($select,customSelectSpan);

                        $select.css({
                            width:    '',
                            position: '',
                            height:   '',
                            fontSize: ''
                        });
                        
                        var selectBoxWidth = parseInt($select.outerWidth(), 10) -
                                (parseInt(customSelectSpan.outerWidth(), 10) -
                                    parseInt(customSelectSpan.width(), 10));
                        
                        // In case of selects being hidden on the page, check display. 
                        var isHidden = false;
                        if ($select.css('display') == 'none') {
                            isHidden = true;
                        }

                        // If select is visible, set to inline-block before calculating outerHeight
                        customSelectSpan.css({
                            display: isHidden ? 'none' : 'inline-block'
                        });
                        
                        var selectBoxHeight = customSelectSpan.outerHeight();

                        if ($select.attr('disabled')) {
                            customSelectSpan.addClass(getClass('disabled'));
                        } else {
                            customSelectSpan.removeClass(getClass('disabled'));
                        }

                        customSelectInnerSpan.css({
                            width:   selectBoxWidth,
                            display: 'inline-block'
                        });

                        $select.css({
                            '-webkit-appearance': 'menulist-button',
                            width:                customSelectSpan.outerWidth(),
                            position:             'absolute',
                            'z-index':            1,
                            opacity:              0,
                            height:               selectBoxHeight,
                            fontSize:             customSelectSpan.css('font-size')
                        });
                    })
                    .on('change.customSelect', function () {
                        customSelectSpan.addClass(getClass('changed'));
                        changed($select,customSelectSpan);
                    })
                    .on('keyup.customSelect', function (e) {
                        if(!customSelectSpan.hasClass(getClass('open'))){
                            $select.trigger('blur.customSelect');
                            $select.trigger('focus.customSelect');
                        }else{
                            if(e.which==13||e.which==27){
                                changed($select,customSelectSpan);
                            }
                        }
                    })
                    .on('mousedown.customSelect', function () {
                        customSelectSpan.removeClass(getClass('changed'));
                    })
                    .on('mouseup.customSelect', function (e) {
                        
                        if( !customSelectSpan.hasClass(getClass('open'))){
                            // if FF and there are other selects open, just apply focus
                            if($('.'+getClass('open')).not(customSelectSpan).length>0 && typeof InstallTrigger !== 'undefined'){
                                $select.trigger('focus.customSelect');
                            }else{
                                customSelectSpan.addClass(getClass('open'));
                                e.stopPropagation();
                                $(document).one('mouseup.customSelect', function (e) {
                                    if( e.target != $select.get(0) && $.inArray(e.target,$select.find('*').get()) < 0 ){
                                        $select.trigger('blur.customSelect');
                                    }else{
                                        changed($select,customSelectSpan);
                                    }
                                });
                            }
                        }
                    })
                    .on('focus.customSelect', function () {
                        customSelectSpan.removeClass(getClass('changed')).addClass(getClass('focus'));
                    })
                    .on('blur.customSelect', function () {
                        customSelectSpan.removeClass(getClass('focus')+' '+getClass('open'));
                    })
                    .on('mouseenter.customSelect', function () {
                        customSelectSpan.addClass(getClass('hover'));
                    })
                    .on('mouseleave.customSelect', function () {
                        customSelectSpan.removeClass(getClass('hover'));
                    })
                    .trigger('render.customSelect');
            });
        }
    });
})(jQuery);
