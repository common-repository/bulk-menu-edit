jQuery(document).ready(function ($) {

    const { __ } = wp.i18n;
    textDomain = 'bulk-menu-edit';

    let $body = $('body');
    let $currentMenu = $('#menu-to-edit');
    let $MenuFooter = $('#save_menu_footer');

    // Return if not menu admin page
    if (!$body.hasClass('nav-menus-php')) { return; }

    // Add check all button
    $currentMenu.before('<div class="div__chck_box_top_all"><label class="label__chck_checkbox"></label><p><span>' + __('Check', textDomain) + '</span>' + __(' all menu items', textDomain) + '</p></div>');
    $currentMenu.before('<div class="div__chck_box_top_collapse"><label class="label__chck_checkbox"></label><p>' + __('Collapse All', textDomain) + '</p></div>');
    $currentMenu.before('<div class="div__chck_box_top_expand"><label class="label__chck_checkbox"></label><p>' + __('Expand All', textDomain) + '</p></div>');

    // Add remove selected items button
    $MenuFooter.before('<form id="ajax-remove-menu" style="display:none;" method="post"><input type="submit" id="remove_menu_items" class="button button-primary button-large menu-save" value="' + __('Remove selected items', textDomain) + '"></form>');

    // Add checkbox for existing menu item
    $('#menu-to-edit li').each(function () {
        let $this = $(this);
        let menu_id = $this.attr('id');
        let item_title = $this.find('.item-title');
        item_title.before('<label class="label__chck_box" data-menu="' + menu_id + '"></label>');
    });

    // Dynamically add checkbox to menu items
    $('.submit-add-to-menu.right').on('click', function () {

        // Check if check all button exist
        if (!$('#label__chck_box_all')) {
            $('#menu-to-edit').before('<div class="div__chck_box"><label id="label__chck_box_all"></label><p>' + __('Check all menu items', textDomain) + '</p></div>');
        }

        // Add label to all menu items
        setTimeout(() => {
            $('#menu-to-edit li').each(function () {
                let $this = $(this);
                let menu_id = $this.attr('id');
                let $itemTitle = $this.find('.item-title');
                let $labels = $this.find('.label__chck_box');
                if ($labels.length === 0) {
                    $itemTitle.before('<label class="label__chck_box" data-menu="' + menu_id + '"></label>');
                }
            });
        }, 800);
    })

    // Add input type hidden for selected menu items
    $(document).on('click', '.label__chck_box', function () {
        let $this = $(this);
        let menu_id = $this.data('menu');
        setTimeout(() => {
            if (!$this.hasClass('is-checked')) {
                $this.addClass('is-checked');
                $('#ajax-remove-menu').prepend('<input type="hidden" name="menu-to-remove" id="remove-' + menu_id + '" value="' + menu_id + '">');
                $('#ajax-remove-menu').show();
            } else {
                $this.removeClass('is-checked');
                $('#remove-' + menu_id).remove();
            }
        }, 150);
    });

    // Expand All
    $(document).on('click', '.div__chck_box_top_expand', function () {
        $(this).addClass('is-checked');
        $('.div__chck_box_top_collapse').removeClass('is-checked');
        $currentMenu.find('.menu-item').each(function () {
            let $this = $(this);
            $this.removeClass('menu-item-edit-inactive').addClass('menu-item-edit-inactive');
            $this.find('.menu-item-settings').show();
        })
    })

    // Collapse All
    $(document).on('click', '.div__chck_box_top_collapse', function () {
        $(this).addClass('is-checked');
        $('.div__chck_box_top_expand').removeClass('is-checked');
        $currentMenu.find('.menu-item').each(function () {
            let $this = $(this);
            $this.removeClass('menu-item-edit-active').addClass('menu-item-edit-inactive');
            $this.find('.menu-item-settings').hide();
        })
    })

    // Check all menu items at once
    $(document).on('click', '.div__chck_box_top_all', function () {
        let $this = $(this);
        $this.toggleClass('is-checked');
        // Check all items
        if ($this.hasClass('is-checked')) {
            $currentMenu.find('p span').html(__('Uncheck', textDomain));
            $currentMenu.find('li').each(function () {
                let $this = $(this);
                if (!$this.find('.label__chck_box').hasClass('is-checked')) {
                    $this.find('.label__chck_box').addClass('is-checked');
                    $('#ajax-remove-menu').prepend('<input type="hidden" name="menu-to-remove" id="remove-' + $this.attr('id') + '" value="' + $this.attr('id') + '">');
                }
            })
            $('#ajax-remove-menu').show();
            // Uncheck all items
        } else {
            $this.find('p span').html(__('Check', textDomain));
            $('#ajax-remove-menu input[type=hidden]').remove();
            $currentMenu.find('li').each(function () {
                let $this = $(this);
                if ($this.find('.label__chck_box').hasClass('is-checked')) {
                    $this.find('.label__chck_box').removeClass('is-checked');
                    $('#remove-' + $this.attr('id')).remove();
                }
            })
            $('#ajax-remove-menu').hide();
        }
    });

    // Ajax call to remove selected menu items
    $('#ajax-remove-menu').submit(function (e) {
        e.preventDefault();
        let form_data = $(this).serializeArray();
        let answer = confirm(__('Do you really want to remove all the menu items selected ?', textDomain));
        if (answer) {
            $.ajax({
                method: 'POST',
                url: ajaxurl,
                data: {
                    action: 'remove_menu_items',
                    data: form_data,
                },
            })
                .success(function (response) {
                    $('.label__chck_box.is-checked').each(function () {
                        $(this).parents('div[class^="menu-item"]').eq(0).remove();
                    });
                    location.reload();
                })
        }
    });

});