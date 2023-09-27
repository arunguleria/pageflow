module PageflowScrolled
  class Chapter < Pageflow::ApplicationRecord
    include Pageflow::SerializedConfiguration
    include Pageflow::AutoGeneratedPermaId
    include Pageflow::NestedRevisionComponent

    belongs_to :storyline, touch: true
    has_many :sections,
             -> { order('pageflow_scrolled_sections.position ASC') },
             dependent: :destroy,
             inverse_of: :chapter
    has_many :content_elements, through: :sections

    nested_revision_components :sections

    attr_accessor :revision # used on :create to lazily create storyline
    before_validation :ensure_storyline, on: :create

    def create_section(attributes = {})
      shift_section_positions(from: attributes[:position])

      section = sections.create!(attributes)
      section.content_elements.create!(type_name: 'textBlock')

      section
    end

    def duplicate_section(section)
      shift_section_positions(from: section.position + 1)

      section.duplicate do |new_section|
        new_section.position = section.position + 1
      end
    end

    def self.all_for_revision(revision)
      joins(storyline: :revision)
        .where(pageflow_scrolled_storylines: {revision_id: revision})
    end

    private

    def shift_section_positions(from:)
      sections
        .where('position >= ?', from)
        .update_all('position = position + 1')
    end

    def ensure_storyline
      return if storyline.present?
      unless Storyline.all_for_revision(revision).exists?
        Storyline.create!(revision: revision, configuration: {main: true})
      end
      self.storyline = Storyline.all_for_revision(revision).first
    end
  end
end
