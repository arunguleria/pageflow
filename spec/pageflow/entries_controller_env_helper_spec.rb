require 'spec_helper'

module Pageflow
  describe EntriesControllerEnvHelper do
    describe '#get_published_entry_from_env' do
      it 'reads entry from where add_published_entry_to_env puts it' do
        env = {}
        entry = build(:entry)

        EntriesControllerEnvHelper.add_published_entry_to_env(env, entry)
        result = EntriesControllerEnvHelper.get_published_entry_from_env(env)

        expect(result).to eq(entry)
      end

      it 'fails with a helpful message when info is missing in env' do
        expect {
          EntriesControllerEnvHelper.get_published_entry_from_env({})
        }.to raise_error(/Use Pageflow::EntriesControllerTestHelper/)
      end
    end
  end
end
