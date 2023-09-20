module ApplicationHelper
  def edit_and_destroy_buttons(item)
    return unless current_user&.admin?

    edit = link_to('Edit', url_for([:edit, item]), class: "btn btn-primary")
    del = link_to('Destroy', item, method: :delete,
                                   form: { data: { turbo_confirm: "Are you sure ?" } },
                                   class: "btn btn-danger")
    raw("#{edit} #{del}")
  end

  def round(value)
    number_with_precision(value, precision: 1)
  end
end
